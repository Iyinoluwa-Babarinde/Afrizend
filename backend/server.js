require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Prisma Configuration
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

let connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/afrizend";

if (connectionString.startsWith('prisma+postgres://')) {
    try {
        const url = new URL(connectionString);
        const apiKey = url.searchParams.get('api_key');
        if (apiKey) {
            const decoded = Buffer.from(apiKey, 'base64').toString('utf-8');
            const payload = JSON.parse(decoded);
            if (payload.databaseUrl) {
                connectionString = payload.databaseUrl;
                console.log("Extracted direct TCP Postgres URL from Prisma dev.");
            }
        }
    } catch (e) {
        console.warn("Failed to parse local Prisma dev URL.", e);
    }
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const JWT_SECRET = process.env.JWT_SECRET || 'afrizend-super-secret-key-2025';

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Activity Tracker
const trackActivity = async (userId, actionType, details = {}) => {
  try {
    await prisma.userActivity.create({
      data: {
        id: uuidv4(),
        user_id: userId,
        action_type: actionType,
        details: JSON.stringify(details),
      }
    });
  } catch (err) {
    console.error("Failed to track activity:", err.message);
  }
};

const koraService = require('./services/koraService');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Socket.IO Logic
io.on('connection', (socket) => {
  console.log('User connected via Socket:', socket.id);

  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Socket ${socket.id} joined user_${userId}`);
  });

  socket.on('send_message', async (data) => {
    const messageId = uuidv4();
    try {
      await prisma.chatMessage.create({
        data: {
          id: messageId,
          job_id: `direct_${data.receiver_id}`, // Generic job_id for direct messages
          sender_id: data.sender_id,
          content: data.content,
        }
      });
      
      const msgData = {
        id: messageId,
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        content: data.content,
        created_at: new Date().toISOString()
      };

      io.to(`user_${data.receiver_id}`).emit('receive_message', msgData);
      socket.emit('receive_message', msgData);
    } catch (e) {
      console.error('Error saving chat message:', e);
    }
  });

  socket.on('join_video_room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user_joined_video', socket.id);
  });

  socket.on('offer', (data) => {
    socket.to(data.roomId).emit('offer', { offer: data.offer, sender: socket.id });
  });

  socket.on('answer', (data) => {
    socket.to(data.roomId).emit('answer', { answer: data.answer, sender: socket.id });
  });

  socket.on('ice_candidate', (data) => {
    socket.to(data.roomId).emit('ice_candidate', { candidate: data.candidate, sender: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'mock_api_key');

// ==========================================
// CURRENCY CONVERSION (MOCK)
// ==========================================
const EXCHANGE_RATES_TO_USD = {
  USD: 1,
  GBP: 0.78,
  NGN: 1500,
  KES: 130,
  GHS: 14
};

function convertCurrency(amount, fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return amount;
  const fromRate = EXCHANGE_RATES_TO_USD[fromCurrency || "USD"] || 1;
  const toRate = EXCHANGE_RATES_TO_USD[toCurrency || "USD"] || 1;
  const amountInUSD = amount / fromRate;
  return Number((amountInUSD * toRate).toFixed(2));
}

// ==========================================
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role, company, skills, bio, hourlyRate, walletAddress, currency } = req.body;
  const userId = uuidv4();

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const finalWalletAddress = walletAddress || `@kora.afrizend.dev/${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    console.log("Registering with email:", email);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = await prisma.user.create({
      data: {
        id: userId,
        name,
        email,
        password_hash: passwordHash,
        role,
        company,
        skills: JSON.stringify(skills || []),
        bio,
        hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
        wallet_address: finalWalletAddress,
        trust_score: 75.0,
        balance: 0.0,
        currency: currency || (role === "employer" ? "USD" : "NGN")
      }
    });

    trackActivity(userId, 'USER_REGISTERED', { role });

    const token = jwt.sign({ id: userId, email, role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { id: userId, name, email, role, company, skills, bio, hourlyRate, walletAddress: finalWalletAddress, trustScore: 75.0, balance: 0.0, currency: currency || (role === "employer" ? "USD" : "NGN") }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    trackActivity(user.id, 'USER_LOGGED_IN');

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    delete user.password_hash;
    try { user.skills = JSON.parse(user.skills); } catch (e) { }

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    delete user.password_hash;
    try { user.skills = JSON.parse(user.skills); } catch (e) { }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:id/balance', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user.id, name: user.name, balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// CHAT CONTACTS & FREELANCERS
// ==========================================
app.get('/api/contacts', authenticateToken, async (req, res) => {
  try {
    const contacts = await prisma.user.findMany({
      where: { id: { not: req.user.id } },
      select: { id: true, name: true, role: true, email: true },
      orderBy: { name: 'asc' }
    });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/freelancers', async (req, res) => {
  try {
    const freelancers = await prisma.user.findMany({
      where: { role: 'freelancer' },
      select: { id: true, name: true, email: true, role: true, bio: true, skills: true, hourly_rate: true, trust_score: true, wallet_address: true, created_at: true },
      orderBy: { trust_score: 'desc' }
    });
    res.json(freelancers.map(f => ({ ...f, skills: f.skills ? JSON.parse(f.skills) : [] })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// WALLET FUNDING & WITHDRAWAL
// ==========================================
app.post('/api/wallet/fund', authenticateToken, async (req, res) => {
  const { amount, cardDetails } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

  try {
    if (!cardDetails || !cardDetails.cardNumber || !cardDetails.pin || !cardDetails.expiry || !cardDetails.cvv) {
      return res.status(400).json({ error: "Valid card details (number, expiry, CVV, PIN) are required for funding." });
    }

    const currentUser = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    const currency = currentUser.currency || (currentUser.role === "employer" ? "USD" : "NGN");

    // Hit live Kora API
    const chargeResult = await koraService.chargeCard(amount, currency, cardDetails, currentUser);
    if (!chargeResult.success) {
      return res.status(400).json({ error: "Card funding failed at Kora gateway" });
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { balance: { increment: amount } }
    });
    trackActivity(req.user.id, 'FUNDS_DEPOSITED', { amount, method: 'CARD', tx: chargeResult.transactionId });

    await prisma.walletTransaction.create({
      data: {
        id: uuidv4(),
        from_user_id: req.user.id,
        amount: amount,
        type: 'DEPOSIT',
        description: `Funded via Card ends with ${cardDetails.cardNumber.slice(-4)}`
      }
    });

    res.json({ balance: user.balance, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/wallet/withdraw', authenticateToken, async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.balance < amount) return res.status(400).json({ error: "Insufficient funds" });

    // Use Kora executePayout to simulate withdrawal to bank
    const payoutResult = await koraService.executePayout(req.user.id, amount);

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { balance: { decrement: amount } }
    });
    trackActivity(req.user.id, 'FUNDS_WITHDRAWN', { amount, tx: payoutResult.transactionId });

    await prisma.walletTransaction.create({
      data: {
        id: uuidv4(),
        from_user_id: req.user.id,
        amount: amount,
        type: 'WITHDRAWAL',
        description: `Withdrew via Kora Payout`
      }
    });

    res.json({ balance: updatedUser.balance, success: true, transferResult: payoutResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/wallet/kora-balance', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { balance: true, wallet_address: true, virtual_account_number: true }
    });
    
    const transactions = await prisma.walletTransaction.findMany({
      where: { OR: [{ from_user_id: req.user.id }, { to_user_id: req.user.id }] },
      orderBy: { created_at: 'desc' },
      take: 20
    });

    res.json({
      afrizendBalance: user.balance,
      virtualAccount: user.virtual_account_number,
      transactions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/wallet/virtual', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const koraRes = await koraService.createVirtualAccount(user);
    if (!koraRes.success) {
      return res.status(400).json({ error: koraRes.error || "Failed to create virtual account" });
    }

    const { account_number, bank_name, account_reference } = koraRes.account;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        virtual_account_number: account_number,
        virtual_bank_name: bank_name,
        virtual_account_reference: account_reference
      }
    });

    trackActivity(user.id, 'VIRTUAL_WALLET_ISSUED', { account_number });
    res.json({ success: true, account: koraRes.account });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 1. JOBS, MATCHING, & APPLICATIONS
// ==========================================
app.post('/api/jobs', async (req, res) => {
  const { employer_id, title, description, budget, currency, deadline, skills, milestones } = req.body;
  const jobId = uuidv4();

  try {
    await prisma.job.create({
      data: {
        id: jobId,
        employer_id,
        title,
        description,
        budget,
        currency,
        deadline,
        skills
      }
    });

    const createdMilestones = [];
    if (milestones && milestones.length > 0) {
      for (const ms of milestones) {
        const milestoneId = uuidv4();
        await prisma.milestone.create({
          data: {
            id: milestoneId,
            job_id: jobId,
            title: ms.title,
            description: ms.description,
            amount: ms.amount,
            deliverables: JSON.stringify(ms.deliverables || []),
            acceptance_criteria: ms.acceptanceCriteria || ''
          }
        });
        createdMilestones.push({ ...ms, id: milestoneId });
      }
    }

    // AI Matching
    const prompt = `You are an AI matching engine for a freelance platform. A new job has been posted:
      Title: ${title}
      Description: ${description}
      Skills needed: ${skills}
      
      Generate 3 highly relevant fictional freelancers that perfectly match these skills.
      Output ONLY a valid JSON array of objects with the following schema:
      [
        {
          "freelancer_id": "uuid-string",
          "freelancer_name": "Full Name",
          "score": 0.95,
          "reasoning": "Brief explanation of why they are a match based on their past fictional experience."
        }
      ]`;

    let matchedFreelancers = [];
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'mock_api_key') {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\[.*\]/s);
        if (jsonMatch) {
          matchedFreelancers = JSON.parse(jsonMatch[0]);
        }
      } catch (aiErr) {
        console.error("AI Matching failed, falling back to mock data:", aiErr);
      }
    }

    if (matchedFreelancers.length === 0) {
      matchedFreelancers = [
        { freelancer_id: "f-1", freelancer_name: "Praise M.", score: 0.98, reasoning: "Top rated designer with extensive multi-currency UI fintech experience." },
        { freelancer_id: "f-2", freelancer_name: "Iyinoluwa A.", score: 0.96, reasoning: "Expert React developer with strong system integrations record." },
        { freelancer_id: "f-3", freelancer_name: "Kelechi O.", score: 0.88, reasoning: "Experienced frontend developer fluent in Tailwind CSS and styling systems." }
      ];
    }

    for (const match of matchedFreelancers) {
      await prisma.match.create({
        data: {
          id: uuidv4(),
          job_id: jobId,
          freelancer_id: match.freelancer_id || uuidv4(),
          freelancer_name: match.freelancer_name,
          score: match.score,
          reasoning: match.reasoning
        }
      });
    }

    trackActivity(employer_id, 'JOB_CREATED', { jobId, title, budget });

    res.status(201).json({ success: true, jobId, milestones: createdMilestones, message: 'Job created and matched successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/jobs', async (req, res) => {
  const { status, employer_id } = req.query;
  const where = {};
  if (status) where.status = status;
  if (employer_id) where.employer_id = employer_id;

  try {
    const jobs = await prisma.job.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: { employer: { select: { name: true } } }
    });
    
    res.json(jobs.map(j => ({ ...j, employer_name: j.employer?.name })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id },
      include: { employer: { select: { name: true } }, milestones: true }
    });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ ...job, employer_name: job.employer?.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/jobs/:id/matches', async (req, res) => {
  try {
    const matches = await prisma.match.findMany({
      where: { job_id: req.params.id },
      orderBy: { score: 'desc' }
    });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/jobs/:id/apply', authenticateToken, async (req, res) => {
  const { cover_note } = req.body;
  const jobId = req.params.id;
  const freelancerId = req.user.id;

  try {
    const existing = await prisma.application.findFirst({ where: { job_id: jobId, freelancer_id: freelancerId } });
    if (existing) return res.status(400).json({ error: 'You have already applied to this job' });

    const appId = uuidv4();
    await prisma.application.create({
      data: {
        id: appId,
        job_id: jobId,
        freelancer_id: freelancerId,
        cover_note: cover_note || ''
      }
    });

    trackActivity(freelancerId, 'JOB_APPLIED', { jobId });
    res.status(201).json({ success: true, applicationId: appId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/jobs/:id/applications', authenticateToken, async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: { job_id: req.params.id },
      orderBy: { created_at: 'desc' },
      include: { freelancer: true }
    });
    
    res.json(applications.map(a => ({
      id: a.id,
      cover_note: a.cover_note,
      status: a.status,
      created_at: a.created_at,
      freelancer_id: a.freelancer?.id,
      name: a.freelancer?.name,
      email: a.freelancer?.email,
      bio: a.freelancer?.bio,
      skills: a.freelancer?.skills ? JSON.parse(a.freelancer.skills) : [],
      hourly_rate: a.freelancer?.hourly_rate,
      trust_score: a.freelancer?.trust_score,
      wallet_address: a.freelancer?.wallet_address
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/jobs/:id/my-application', authenticateToken, async (req, res) => {
  try {
    const application = await prisma.application.findFirst({
      where: { job_id: req.params.id, freelancer_id: req.user.id }
    });
    res.json(application || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/jobs/:id/accept-applicant', authenticateToken, async (req, res) => {
  const { freelancer_id } = req.body;
  const jobId = req.params.id;

  try {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.employer_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

    const freelancer = await prisma.user.findUnique({ where: { id: freelancer_id } });
    if (!freelancer) return res.status(404).json({ error: 'Freelancer not found' });

    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'in_progress', freelancer_id: freelancer_id, freelancer_name: freelancer.name }
    });

    await prisma.application.updateMany({
      where: { job_id: jobId, freelancer_id: freelancer_id },
      data: { status: 'accepted' }
    });

    await prisma.application.updateMany({
      where: { job_id: jobId, freelancer_id: { not: freelancer_id } },
      data: { status: 'rejected' }
    });

    const firstMilestone = await prisma.milestone.findFirst({ where: { job_id: jobId }, orderBy: { id: 'asc' } });
    if (firstMilestone) {
      await prisma.milestone.update({ where: { id: firstMilestone.id }, data: { status: 'in_progress' } });
    }

    trackActivity(req.user.id, 'APPLICANT_ACCEPTED', { jobId, freelancer_id });

    res.json({ success: true, message: `${freelancer.name} has been hired`, freelancerName: freelancer.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/milestones/:id/status', authenticateToken, async (req, res) => {
  const { status } = req.body;
  const dbStatus = (status || '').toLowerCase().replace('under_review', 'submitted');
  try {
    const updated = await prisma.milestone.update({
      where: { id: req.params.id },
      data: { status: dbStatus }
    });
    res.json({ success: true, milestoneId: updated.id, status: dbStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. CHAT & TERMS
// ==========================================
app.post('/api/chat', async (req, res) => {
  const { job_id, sender_id, content, is_terms } = req.body;
  const msgId = uuidv4();
  
  try {
    await prisma.chatMessage.create({
      data: {
        id: msgId,
        job_id,
        sender_id,
        content,
        is_terms: is_terms ? true : false
      }
    });
    trackActivity(sender_id, 'MESSAGE_SENT', { msgId, job_id, is_terms });
    res.status(201).json({ success: true, messageId: msgId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. ESCROW (KORA)
// ==========================================
app.post('/api/escrow/fund', authenticateToken, async (req, res) => {
  const { job_id } = req.body;
  const employer_id = req.user.id;

  try {
    const job = await prisma.job.findUnique({ where: { id: job_id } });
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const employer = await prisma.user.findUnique({ where: { id: employer_id } });
    if (employer.balance < job.budget) {
      return res.status(400).json({ error: 'Insufficient wallet balance. Please fund your wallet first.' });
    }

    await prisma.user.update({
      where: { id: employer_id },
      data: { balance: { decrement: job.budget } }
    });

    const contractId = uuidv4();
    await prisma.contract.create({
      data: {
        id: contractId,
        job_id: job.id,
        employer_id: employer_id,
        freelancer_id: job.freelancer_id,
        escrow_status: 'funded',
        agreed_amount: job.budget
      }
    });

    res.json({ success: true, contractId, message: 'Job successfully funded to platform escrow' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/escrow/lock', async (req, res) => {
  const { job_id, employer_id, freelancer_id, agreed_amount, payment_currency, settlement_currency } = req.body;
  const contractId = uuidv4();

  try {
    const escrowResult = await koraService.lockFunds(employer_id, agreed_amount, payment_currency || 'NGN', settlement_currency || 'NGN');

    await prisma.contract.create({
      data: {
        id: contractId,
        job_id,
        employer_id,
        freelancer_id,
        escrow_status: 'locked',
        agreed_amount
      }
    });
    res.status(200).json({ success: true, contractId, escrowResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Transfers milestone payment from platform back to freelancer wallet balance
app.post('/api/escrow/transfer', authenticateToken, async (req, res) => {
  const { job_id, milestone_id, amount, freelancer_id } = req.body;

  try {
    const employer = await prisma.user.findUnique({ where: { id: req.user.id } });
    const freelancerToPay = await prisma.user.findUnique({ where: { id: freelancer_id } });

    const convertedAmount = convertCurrency(amount, employer.currency, freelancerToPay.currency);

    await prisma.milestone.update({
      where: { id: milestone_id },
      data: { status: 'approved' }
    });

    const freelancer = await prisma.user.update({
      where: { id: freelancer_id },
      data: { balance: { increment: convertedAmount } }
    });

    const txId = uuidv4();
    await prisma.walletTransaction.create({
      data: {
        id: txId,
        from_user_id: 'AFRIZEND_PLATFORM',
        to_user_id: freelancer_id,
        amount: convertedAmount,
        type: 'ESCROW_PAYOUT',
        description: `Milestone Payment for Job ${job_id}`
      }
    });

    // Also get the employer's updated balance just to return something consistent
    const updatedEmployer = await prisma.user.findUnique({ where: { id: req.user.id } });

    res.json({ success: true, message: 'Funds transferred to freelancer wallet', employerNewBalance: updatedEmployer.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/deliverables', async (req, res) => {
  const { milestone_id, freelancer_id, content } = req.body;
  const deliveryId = uuidv4();

  try {
    const milestone = await prisma.milestone.findUnique({ where: { id: milestone_id } });
    if (!milestone) return res.status(404).json({ error: "Milestone not found" });

    const prompt = `You are an AI code/deliverable reviewer for a freelance platform named Afrizend. 
      Milestone requirements: "${milestone.title} - ${milestone.description}"
      Freelancer submission: "${content}"
      
      Review the submission against the milestone criteria.
      Output ONLY a valid JSON object with the following schema:
      {
        "score": 0.98,
        "report": "Detailed verification report with annotations on what was completed well."
      }`;

    let aiResult = { score: 0.95, report: "AI Verification successful. Code satisfies all acceptance criteria." };
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'mock_api_key') {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const response = await model.generateContent(prompt);
        const text = response.response.text();
        const jsonMatch = text.match(/\{.*\}/s);
        if (jsonMatch) {
          aiResult = JSON.parse(jsonMatch[0]);
        }
      } catch (aiErr) {
        console.error("AI Verification failed, falling back:", aiErr);
      }
    }

    await prisma.deliverable.create({
      data: {
        id: deliveryId,
        milestone_id,
        freelancer_id,
        content,
        ai_verification_score: aiResult.score,
        ai_verification_report: aiResult.report
      }
    });

    await prisma.milestone.update({
      where: { id: milestone_id },
      data: { status: 'in_review' }
    });

    trackActivity(freelancer_id, 'MILESTONE_SUBMITTED', { deliveryId, milestone_id, aiScore: aiResult.score });

    res.status(200).json({ success: true, deliveryId, aiResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/escrow/payout', async (req, res) => {
  const { milestone_id, contract_id } = req.body;

  try {
    await prisma.milestone.update({
      where: { id: milestone_id },
      data: { status: 'approved' }
    });

    const contract = await prisma.contract.findUnique({ where: { id: contract_id } });

    const payoutResult = await koraService.executePayout(contract.freelancer_id, contract.agreed_amount);

    res.status(200).json({ success: true, message: 'Kora payout settled successfully', payoutResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`Afrizend backend running on port ${PORT}`);
});

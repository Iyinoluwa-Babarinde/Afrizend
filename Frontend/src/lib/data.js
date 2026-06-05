export const DEMO_JOBS = [
    {
        id: "job_1",
        employerId: "user_employer_1",
        employerName: "Alex Client",
        title: "Build a React Native Mobile App",
        description: "Looking for an experienced React Native developer to build a mobile app for our e-commerce store.",
        skills: ["React Native", "TypeScript", "Redux"],
        budget: 5000,
        status: "OPEN",
        milestones: [],
        createdAt: new Date().toISOString(),
        deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
        escrow: {
            status: "PENDING",
            total: 5000,
            funded: 0,
            released: 0,
        },
        downloadUnlocked: false,
    }
];

export const DEMO_TRANSACTIONS = [
    {
        id: "tx_1",
        date: new Date().toISOString(),
        type: "DEPOSIT",
        amount: 1500,
        status: "COMPLETED",
        description: "Kora Virtual Account Inbound Deposit",
        from: "External Bank (USD)",
        to: "Kora Virtual Wallet",
        txHash: "kora_txn_12389ab",
    },
    {
        id: "tx_2",
        date: new Date(Date.now() - 86400000).toISOString(),
        type: "PAYMENT",
        amount: -500,
        status: "COMPLETED",
        description: "Milestone 1 Payment Escrow Lock",
        from: "Kora Virtual Wallet",
        to: "Kora Escrow Contract",
        txHash: "kora_escrow_4567def",
    }
];

export const EARNINGS_DATA = [
    { month: "Jan", earnings: 4000 },
    { month: "Feb", earnings: 3000 },
    { month: "Mar", earnings: 2000 },
    { month: "Apr", earnings: 2780 },
    { month: "May", earnings: 1890 },
    { month: "Jun", earnings: 2390 },
    { month: "Jul", earnings: 3490 },
];

export const DEMO_SESSIONS = [
    {
        id: "session_1",
        title: "Technical Interview",
        consultantId: "user_freelancer_1",
        consultantName: "Sam Developer",
        employerId: "user_employer_1",
        employerName: "Alex Client",
        startTime: new Date(Date.now() + 86400000).toISOString(),
        date: new Date(Date.now() + 86400000).toISOString(),
        durationMinutes: 60,
        duration: 60,
        totalCharged: 80,
        status: "SCHEDULED",
        freelancer: {
            name: "Sam Developer",
            title: "Senior Full Stack Engineer",
            avatar: "https://i.pravatar.cc/150?u=sam",
            ratePerMinute: 1.33,
        }
    }
];

export const DEMO_CONSULTANTS = [
    {
        id: "user_freelancer_1",
        name: "Sam Developer",
        title: "Senior Full Stack Engineer",
        hourlyRate: 80,
        ratePerMinute: 1.33,
        skills: ["React", "Node.js", "TypeScript"],
        rating: 4.9,
        trustScore: 99,
        reviews: 120,
        avatar: "https://i.pravatar.cc/150?u=sam",
    }
];

export const DEMO_FREELANCERS = DEMO_CONSULTANTS;

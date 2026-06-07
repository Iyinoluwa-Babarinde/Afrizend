require('dotenv').config();
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
            }
        }
    } catch (e) { }
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  try {
    console.log("Starting currency migration...");

    // Update all employers to USD
    const employers = await prisma.user.updateMany({
      where: { role: 'employer' },
      data: { currency: 'USD' }
    });
    console.log(`Updated ${employers.count} employers to USD.`);

    // Update all freelancers to NGN if null
    const freelancers = await prisma.user.updateMany({
      where: { role: 'freelancer', currency: null },
      data: { currency: 'NGN' }
    });
    console.log(`Updated ${freelancers.count} freelancers to NGN.`);

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

run();

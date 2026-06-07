require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;
console.log("Using DB URL:", connectionString);

let prisma;
if (connectionString.startsWith('prisma+postgres://')) {
    prisma = new PrismaClient({ accelerateUrl: connectionString });
} else {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
}

async function main() {
    try {
        const user = await prisma.user.findUnique({ where: { email: 'test@example.com' } });
        console.log("USER:", user);
    } catch (e) {
        console.error("Query failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();

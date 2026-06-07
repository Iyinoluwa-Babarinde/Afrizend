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

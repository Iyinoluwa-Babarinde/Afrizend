require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

let connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/afrizend";
if (connectionString.startsWith('prisma+postgres://')) {
    const url = new URL(connectionString);
    const apiKey = url.searchParams.get('api_key');
    const decoded = Buffer.from(apiKey, 'base64').toString('utf-8');
    connectionString = JSON.parse(decoded).databaseUrl;
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

console.log(Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));

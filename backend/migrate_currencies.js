require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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

const prisma = require('./src/config/prisma');

async function check() {
  try {
    const contacts = await prisma.contact.findMany();
    console.log('Contacts in database:', contacts);
  } catch (err) {
    console.error('Database query error:', err);
  } finally {
    await prisma.$disconnect();
  }
}
check();

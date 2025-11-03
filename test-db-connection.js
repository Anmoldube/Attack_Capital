const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Test connection
    const result = await prisma.$executeRaw`SELECT 1 as connected`;
    console.log('✅ Database connection successful!');
    console.log('Query result:', result);
    
    // Test table creation
    const testData = await prisma.testConnection.create({
      data: {
        name: 'Prisma Connection Test',
      },
    });
    console.log('✅ Test record created:', testData);
    
    // Read data back
    const readData = await prisma.testConnection.findMany();
    console.log('✅ Records in database:', readData);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
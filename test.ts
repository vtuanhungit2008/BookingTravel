import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Đã kết nối đến database thành công!');
  } catch (error) {
    console.error('❌ Kết nối database thất bại:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

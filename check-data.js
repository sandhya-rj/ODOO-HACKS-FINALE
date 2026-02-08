const { PrismaClient } = require('./backend/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    take: 5,
    select: { id: true, name: true, email: true, role: true }
  });
  
  console.log('Users in database:');
  console.table(users);
  
  const quizzes = await prisma.quiz.findMany({
    take: 3,
    select: { id: true, title: true, courseId: true }
  });
  
  console.log('\nQuizzes in database:');
  console.table(quizzes);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

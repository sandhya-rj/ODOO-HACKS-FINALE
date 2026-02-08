const { PrismaClient } = require('./backend/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const userId = 'cac7caff-6f69-483f-a39d-50abbf8f54ac'; // Emma Wilson
  const quizId = 'quiz-js-fundamentals';
  
  // Check QuizAttempt
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId, quizId },
    orderBy: { attemptedAt: 'desc' },
    take: 3
  });
  
  console.log('QuizAttempts for Emma Wilson:');
  console.table(attempts);
  
  // Check PointsLedger
  const points = await prisma.pointsLedger.findMany({
    where: { userId, sourceType: 'QUIZ' },
    orderBy: { createdAt: 'desc' },
    take: 3
  });
  
  console.log('\nPointsLedger entries (QUIZ):');
  console.table(points);
  
  // Check Events
  const events = await prisma.event.findMany({
    where: { userId, type: 'QUIZ_SUBMITTED' },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: { id: true, type: true, createdAt: true, metadata: true }
  });
  
  console.log('\nEvents (QUIZ_SUBMITTED):');
  console.table(events);
  
  // Check total points
  const totalPoints = await prisma.pointsLedger.aggregate({
    where: { userId },
    _sum: { points: true }
  });
  
  console.log(`\nTotal Points for Emma Wilson: ${totalPoints._sum.points || 0}`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

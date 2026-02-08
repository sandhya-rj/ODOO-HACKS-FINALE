const { PrismaClient } = require('./backend/generated/prisma/client');
const prisma = new PrismaClient();

async function listQuizzes() {
  const quizzes = await prisma.quiz.findMany({
    select: {
      id: true,
      title: true,
      courseId: true,
      course: {
        select: { title: true }
      }
    }
  });

  console.log('\n=== Available Quizzes in Database ===\n');
  quizzes.forEach(q => {
    console.log(`Quiz ID: ${q.id}`);
    console.log(`Title: ${q.title}`);
    console.log(`Course: ${q.course.title}`);
    console.log('---');
  });
  
  await prisma.$disconnect();
}

listQuizzes().catch(console.error);

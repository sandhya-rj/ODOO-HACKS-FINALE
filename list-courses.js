const { PrismaClient } = require('./backend/generated/prisma/client');
const prisma = new PrismaClient();

async function listCourses() {
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      quizzes: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });

  console.log('\n=== Courses in Database ===\n');
  courses.forEach(c => {
    console.log(`Course ID: ${c.id}`);
    console.log(`Title: ${c.title}`);
    console.log(`Quizzes:`);
    c.quizzes.forEach(q => console.log(`  - ${q.id}: ${q.title}`));
    console.log('---');
  });
  
  await prisma.$disconnect();
}

listCourses().catch(console.error);

const { PrismaClient } = require('./backend/generated/prisma/client');
const prisma = new PrismaClient();

async function listAllLearners() {
  const users = await prisma.user.findMany({
    where: { role: 'LEARNER' },
    select: { name: true, email: true }
  });

  console.log('\n=== All Learners ===');
  users.forEach(u => console.log(`✓ ${u.name} (${u.email})`));
  console.log(`\nTotal: ${users.length} learners`);
  
  await prisma.$disconnect();
}

listAllLearners().catch(console.error);

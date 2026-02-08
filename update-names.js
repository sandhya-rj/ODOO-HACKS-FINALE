const { PrismaClient } = require('./backend/generated/prisma/client');
const prisma = new PrismaClient();

async function updateUserNames() {
  console.log('Updating user names...\n');

  // Update learner1 (Emma Wilson → Sandhya RJ)
  await prisma.user.update({
    where: { email: 'emma.wilson@student.com' },
    data: { name: 'Sandhya RJ' }
  });
  console.log('✅ Updated: Sandhya RJ');

  // Update learner2 (James Martinez → Bala Vignesh VT)
  await prisma.user.update({
    where: { email: 'james.martinez@student.com' },
    data: { name: 'Bala Vignesh VT' }
  });
  console.log('✅ Updated: Bala Vignesh VT');

  // Update learner3 (Olivia Brown → Prarthana B)
  await prisma.user.update({
    where: { email: 'olivia.brown@student.com' },
    data: { name: 'Prarthana B' }
  });
  console.log('✅ Updated: Prarthana B');

  // Update learner4 (Noah Davis → Gopika Sree KC)
  await prisma.user.update({
    where: { email: 'noah.davis@student.com' },
    data: { name: 'Gopika Sree KC' }
  });
  console.log('✅ Updated: Gopika Sree KC');

  console.log('\n🎉 All names updated successfully!');
  await prisma.$disconnect();
}

updateUserNames().catch(console.error);

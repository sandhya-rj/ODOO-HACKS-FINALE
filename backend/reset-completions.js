const prisma = require('./src/lib/prisma');

(async () => {
  const userId = 'cac7caff-6f69-483f-a39d-50abbf8f54ac';

  // Delete ALL COURSE_COMPLETED events
  const deletedEvents = await prisma.event.deleteMany({
    where: { userId, type: 'COURSE_COMPLETED' }
  });
  console.log('Deleted COURSE_COMPLETED events:', deletedEvents.count);

  // Delete ALL course completion points
  const deletedPoints = await prisma.pointsLedger.deleteMany({
    where: { userId, sourceType: 'COURSE' }
  });
  console.log('Deleted COURSE points:', deletedPoints.count);

  // Reset ALL enrollments back to IN_PROGRESS
  const updatedEnrollments = await prisma.courseEnrollment.updateMany({
    where: { userId, status: 'COMPLETED' },
    data: { status: 'IN_PROGRESS', completedAt: null }
  });
  console.log('Reset enrollments to IN_PROGRESS:', updatedEnrollments.count);

  // Delete course completion notifications
  const deletedNotifs = await prisma.notification.deleteMany({
    where: { title: { contains: 'completed' } }
  });
  console.log('Deleted notifications:', deletedNotifs.count);

  // Verify final state
  const points = await prisma.pointsLedger.aggregate({
    where: { userId },
    _sum: { points: true }
  });
  console.log('Points now:', points._sum.points);

  const enrollments = await prisma.courseEnrollment.findMany({
    where: { userId },
    select: { courseId: true, status: true }
  });
  console.log('Enrollments:', enrollments);

  await prisma.$disconnect();
})();

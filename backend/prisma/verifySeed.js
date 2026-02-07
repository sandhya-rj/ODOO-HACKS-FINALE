require('dotenv/config');
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient({});

async function verify() {
  console.log('\n🔍 Verifying Seeded Database...\n');

  // Users grouped by role
  const usersByRole = await prisma.user.groupBy({
    by: ['role'],
    _count: { role: true },
  });
  console.log('👥 USERS BY ROLE:');
  usersByRole.forEach(group => {
    console.log(`   ${group.role}: ${group._count.role}`);
  });

  // Total courses
  const coursesCount = await prisma.course.count();
  console.log(`\n📚 COURSES: ${coursesCount}`);

  // Total lessons
  const lessonsCount = await prisma.lesson.count();
  console.log(`📝 LESSONS: ${lessonsCount}`);

  // Enrollments grouped by status
  const enrollmentsByStatus = await prisma.courseEnrollment.groupBy({
    by: ['status'],
    _count: { status: true },
  });
  console.log('\n🎓 ENROLLMENTS BY STATUS:');
  enrollmentsByStatus.forEach(group => {
    console.log(`   ${group.status}: ${group._count.status}`);
  });

  // Lesson progress counts
  const completedProgress = await prisma.lessonProgress.count({
    where: { isCompleted: true },
  });
  const incompleteProgress = await prisma.lessonProgress.count({
    where: { isCompleted: false },
  });
  console.log('\n📊 LESSON PROGRESS:');
  console.log(`   Completed: ${completedProgress}`);
  console.log(`   Incomplete: ${incompleteProgress}`);

  // Quiz attempts grouped by userId
  const attemptsByUser = await prisma.quizAttempt.groupBy({
    by: ['userId'],
    _count: { userId: true },
  });
  console.log('\n📝 QUIZ ATTEMPTS BY USER:');
  for (const group of attemptsByUser) {
    const user = await prisma.user.findUnique({
      where: { id: group.userId },
      select: { name: true },
    });
    console.log(`   ${user.name}: ${group._count.userId} attempts`);
  }

  console.log('\n🔎 EXAMPLE RECORDS:\n');

  // Learner with multiple quiz attempts
  const multiAttemptUser = await prisma.user.findFirst({
    where: {
      role: 'LEARNER',
      quizAttempts: {
        some: {},
      },
    },
    include: {
      quizAttempts: {
        orderBy: { attemptNumber: 'asc' },
        include: {
          quiz: {
            select: { title: true },
          },
        },
      },
    },
  });

  if (multiAttemptUser && multiAttemptUser.quizAttempts.length > 0) {
    console.log(`📉 LEARNER WITH MULTIPLE ATTEMPTS: ${multiAttemptUser.name}`);
    multiAttemptUser.quizAttempts.forEach(attempt => {
      console.log(`   Attempt ${attempt.attemptNumber}: Score ${attempt.score}%, Points ${attempt.pointsAwarded}`);
    });
  }

  // Learner with high time spent
  const highTimeSpentProgress = await prisma.lessonProgress.findFirst({
    where: {
      timeSpentSeconds: { gt: 1500 },
    },
    include: {
      user: {
        select: { name: true, role: true },
      },
      lesson: {
        select: { title: true },
      },
    },
    orderBy: { timeSpentSeconds: 'desc' },
  });

  if (highTimeSpentProgress) {
    console.log(`\n⏱️  LEARNER WITH HIGH TIME SPENT: ${highTimeSpentProgress.user.name}`);
    console.log(`   Lesson: "${highTimeSpentProgress.lesson.title}"`);
    console.log(`   Time Spent: ${highTimeSpentProgress.timeSpentSeconds}s (${Math.floor(highTimeSpentProgress.timeSpentSeconds / 60)} minutes)`);
    console.log(`   Completed: ${highTimeSpentProgress.isCompleted ? 'Yes' : 'No'}`);
  }

  // Completed course enrollment
  const completedEnrollment = await prisma.courseEnrollment.findFirst({
    where: { status: 'COMPLETED' },
    include: {
      user: {
        select: { name: true },
      },
      course: {
        select: { title: true },
      },
    },
  });

  if (completedEnrollment) {
    console.log(`\n✅ COMPLETED ENROLLMENT:`);
    console.log(`   Learner: ${completedEnrollment.user.name}`);
    console.log(`   Course: "${completedEnrollment.course.title}"`);
    console.log(`   Enrolled: ${completedEnrollment.enrolledAt.toISOString().split('T')[0]}`);
    console.log(`   Completed: ${completedEnrollment.completedAt.toISOString().split('T')[0]}`);
  }

  // Verify insight engine data signals
  console.log('\n🎯 INSIGHT ENGINE SIGNALS:\n');

  // Struggle signal
  const strugglingAttempts = await prisma.quizAttempt.findMany({
    where: {
      attemptNumber: { gt: 1 },
    },
    orderBy: [
      { userId: 'asc' },
      { attemptNumber: 'asc' },
    ],
    include: {
      user: {
        select: { name: true },
      },
    },
  });

  if (strugglingAttempts.length > 0) {
    console.log(`✓ Struggle Signal: ${strugglingAttempts.length} retry attempts found`);
    const uniqueUsers = [...new Set(strugglingAttempts.map(a => a.userId))];
    console.log(`  ${uniqueUsers.length} learner(s) with multiple attempts`);
  }

  // Pacing signal (incomplete lessons with time spent)
  const pacingSignals = await prisma.lessonProgress.count({
    where: {
      isCompleted: false,
      timeSpentSeconds: { gt: 0 },
    },
  });

  if (pacingSignals > 0) {
    console.log(`✓ Pacing Signal: ${pacingSignals} lessons started but not completed`);
  }

  // Dropoff signal (enrollments not started)
  const dropoffSignals = await prisma.courseEnrollment.count({
    where: { status: 'YET_TO_START' },
  });

  if (dropoffSignals > 0) {
    console.log(`✓ Dropoff Signal: ${dropoffSignals} enrollments not yet started`);
  }

  console.log('\n✅ Database verification complete!\n');
}

verify()
  .catch((e) => {
    console.error('Verification error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

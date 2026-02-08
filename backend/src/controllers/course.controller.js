const prisma = require('../lib/prisma');

exports.createCourse = async (req, res) => {
  // TODO: connect prisma when schema ready
  res.json({ status: "stub" });
};

exports.getCourses = async (req, res) => {
  // TODO: connect prisma when schema ready
  res.json({ status: "stub", courses: [] });
};

exports.getCourseById = async (req, res) => {
  // TODO: connect prisma when schema ready
  res.json({ status: "stub", id: req.params.id });
};

exports.updateCourse = async (req, res) => {
  // TODO: connect prisma when schema ready
  res.json({ status: "stub", updated: true });
};

exports.deleteCourse = async (req, res) => {
  // TODO: connect prisma when schema ready
  res.json({ status: "stub", deleted: true });
};

/**
 * Reset all demo data - clears completions, quiz attempts, points, events
 * Called on every frontend page refresh so the demo always starts fresh
 */
exports.resetDemo = async (req, res) => {
  try {
    const userId = req.body.userId || 'cac7caff-6f69-483f-a39d-50abbf8f54ac';

    // Delete ALL events for this user
    const deletedEvents = await prisma.event.deleteMany({
      where: { userId }
    });

    // Delete ALL points for this user
    const deletedPoints = await prisma.pointsLedger.deleteMany({
      where: { userId }
    });

    // Delete ALL quiz attempts for this user
    const deletedAttempts = await prisma.quizAttempt.deleteMany({
      where: { userId }
    });

    // Delete ALL course progress for this user
    const deletedProgress = await prisma.courseProgress.deleteMany({
      where: { userId }
    });

    // Delete ALL enrollments for this user
    const deletedEnrollments = await prisma.courseEnrollment.deleteMany({
      where: { userId }
    });

    // Delete notifications
    const deletedNotifs = await prisma.notification.deleteMany({
      where: { userId }
    });

    console.log(`🔄 Demo reset for ${userId}: events=${deletedEvents.count}, points=${deletedPoints.count}, attempts=${deletedAttempts.count}, progress=${deletedProgress.count}, enrollments=${deletedEnrollments.count}`);

    res.json({
      success: true,
      message: 'Demo data reset successfully',
      deleted: {
        events: deletedEvents.count,
        points: deletedPoints.count,
        attempts: deletedAttempts.count,
        progress: deletedProgress.count,
        enrollments: deletedEnrollments.count,
        notifications: deletedNotifs.count,
      }
    });
  } catch (error) {
    console.error('Failed to reset demo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get enrollment status for a user in a course
 */
exports.getEnrollmentStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.query;

    if (!userId || !courseId) {
      return res.json({ status: 'NOT_ENROLLED' });
    }

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId }
      },
      select: { status: true, completedAt: true }
    });

    res.json({
      status: enrollment?.status || 'NOT_ENROLLED',
      completedAt: enrollment?.completedAt || null
    });
  } catch (error) {
    console.error('Failed to get enrollment status:', error);
    res.json({ status: 'NOT_ENROLLED' });
  }
};

/**
 * Complete a course - marks enrollment as complete and notifies instructor
 */
exports.completeCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        error: 'userId and courseId are required'
      });
    }

    // Get course and enrollment details
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { 
        courseAdmin: { 
          select: { id: true, name: true, email: true } 
        } 
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if already completed
    const existingEnrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: courseId
        }
      }
    });

    if (existingEnrollment?.status === 'COMPLETED') {
      return res.status(200).json({
        success: true,
        message: 'Course already completed',
        alreadyCompleted: true,
        completedAt: existingEnrollment.completedAt
      });
    }

    // Perform course completion in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update or create enrollment as COMPLETED
      const enrollment = await tx.courseEnrollment.upsert({
        where: {
          userId_courseId: {
            userId: userId,
            courseId: courseId
          }
        },
        update: {
          status: 'COMPLETED',
          completedAt: new Date()
        },
        create: {
          userId: userId,
          courseId: courseId,
          status: 'COMPLETED',
          enrolledAt: new Date(),
          completedAt: new Date()
        }
      });

      // Award completion points (100 points for course completion)
      const completionPoints = 100;
      await tx.pointsLedger.create({
        data: {
          userId: userId,
          sourceType: 'COURSE',
          sourceId: courseId,
          points: completionPoints,
        }
      });

      // Get total lessons count for this course
      const lessonCount = await tx.lesson.count({
        where: { courseId: courseId }
      });

      // Update course progress
      await tx.courseProgress.upsert({
        where: {
          userId_courseId: {
            userId: userId,
            courseId: courseId
          }
        },
        update: {
          lessonsCompleted: lessonCount,
          progressPercentage: 100,
          lastAccessedAt: new Date()
        },
        create: {
          userId: userId,
          courseId: courseId,
          lessonsCompleted: lessonCount,
          totalLessons: lessonCount,
          quizzesCompleted: 1,
          totalQuizzes: 1,
          progressPercentage: 100,
          lastAccessedAt: new Date()
        }
      });

      // Create COURSE_COMPLETED event for instructor notification
      const event = await tx.event.create({
        data: {
          userId: userId,
          course: { connect: { id: courseId } },
          type: 'COURSE_COMPLETED',
          metadata: JSON.stringify({
            courseTitle: course.title,
            learnerName: user.name,
            learnerEmail: user.email,
            completedAt: new Date().toISOString(),
            instructorName: course.courseAdmin?.name || 'Unknown',
            pointsAwarded: completionPoints
          }),
        }
      });

      return {
        enrollment,
        event,
        pointsAwarded: completionPoints
      };
    });

    console.log(`✅ Course completed: ${user.name} finished "${course.title}"`);
    console.log(`📧 Instructor notification sent to: ${course.courseAdmin?.name}`);

    return res.status(200).json({
      success: true,
      message: 'Course completed successfully!',
      data: {
        courseId: courseId,
        courseTitle: course.title,
        completedAt: result.enrollment.completedAt,
        pointsAwarded: result.pointsAwarded,
        instructorNotified: true,
        instructorName: course.courseAdmin?.name
      }
    });

  } catch (error) {
    console.error('❌ Error completing course:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to complete course',
      details: error.message
    });
  }
};


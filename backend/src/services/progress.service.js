const prisma = require("../lib/prisma");

/**
 * Progress Service
 * Handles lesson and course progress tracking
 */

/**
 * Complete a lesson and update course progress
 * @param {string} userId
 * @param {string} lessonId
 * @param {number} timeSpentSeconds
 * @returns {Promise<{lessonProgress, courseProgress, event}>}
 */
async function completeLessonWithProgress(userId, lessonId, timeSpentSeconds) {
  return await prisma.$transaction(async (tx) => {
    // Get lesson details
    const lesson = await tx.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true, courseId: true, title: true },
    });

    if (!lesson) {
      throw new Error("Lesson not found");
    }

    // Upsert lesson progress
    const lessonProgress = await tx.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
        timeSpentSeconds: {
          increment: timeSpentSeconds,
        },
      },
      create: {
        userId,
        lessonId,
        isCompleted: true,
        completedAt: new Date(),
        timeSpentSeconds,
      },
    });

    // Get course totals
    const totalLessons = await tx.lesson.count({
      where: { courseId: lesson.courseId },
    });

    const completedLessons = await tx.lessonProgress.count({
      where: {
        userId,
        isCompleted: true,
        lesson: {
          courseId: lesson.courseId,
        },
      },
    });

    const totalQuizzes = await tx.quiz.count({
      where: { courseId: lesson.courseId },
    });

    const completedQuizzes = await tx.quizAttempt.count({
      where: {
        userId,
        quiz: {
          courseId: lesson.courseId,
        },
      },
      distinct: ["quizId"],
    });

    const progressPercentage =
      totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    // Upsert course progress
    const courseProgress = await tx.courseProgress.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.courseId,
        },
      },
      update: {
        lessonsCompleted: completedLessons,
        totalLessons,
        quizzesCompleted: completedQuizzes,
        totalQuizzes,
        progressPercentage,
        lastAccessedAt: new Date(),
      },
      create: {
        userId,
        courseId: lesson.courseId,
        lessonsCompleted: completedLessons,
        totalLessons,
        quizzesCompleted: completedQuizzes,
        totalQuizzes,
        progressPercentage,
      },
    });

    // Create event
    const event = await tx.event.create({
      data: {
        userId,
        courseId: lesson.courseId,
        lessonId,
        type: "LESSON_COMPLETED",
        metadata: JSON.stringify({
          lessonTitle: lesson.title,
          timeSpent: timeSpentSeconds,
          progressPercentage: Math.round(progressPercentage),
        }),
      },
    });

    // Create notification if milestone reached
    if (progressPercentage >= 100 && completedLessons === totalLessons) {
      await tx.notification.create({
        data: {
          userId,
          title: "Course Completed!",
          message: `Congratulations! You've completed all lessons in this course.`,
          eventId: event.id,
        },
      });
    }

    return {
      lessonProgress,
      courseProgress,
      event,
    };
  });
}

/**
 * Get course progress for a user
 * @param {string} userId
 * @param {string} courseId
 * @returns {Promise<object>}
 */
async function getCourseProgress(userId, courseId) {
  const courseProgress = await prisma.courseProgress.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
    },
  });

  if (!courseProgress) {
    // Return empty progress if not started
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        description: true,
      },
    });

    const totalLessons = await prisma.lesson.count({
      where: { courseId },
    });

    const totalQuizzes = await prisma.quiz.count({
      where: { courseId },
    });

    return {
      userId,
      courseId,
      course,
      lessonsCompleted: 0,
      totalLessons,
      quizzesCompleted: 0,
      totalQuizzes,
      progressPercentage: 0,
      lastAccessedAt: null,
    };
  }

  return courseProgress;
}

/**
 * Get all course progress for a user
 * @param {string} userId
 * @returns {Promise<Array>}
 */
async function getAllUserCourseProgress(userId) {
  return await prisma.courseProgress.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
        },
      },
    },
    orderBy: {
      lastAccessedAt: "desc",
    },
  });
}

module.exports = {
  completeLessonWithProgress,
  getCourseProgress,
  getAllUserCourseProgress,
};

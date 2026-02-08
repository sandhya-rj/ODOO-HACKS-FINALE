const prisma = require("../lib/prisma");
const adapter = require("../services/insightDataAdapter.service");
const insight = require("../services/insight.service");
const fmt = require("../services/alertFormatter.service");

exports.submitQuiz = async (req, res, next) => {
  try {
    const { userId, quizId, score, totalQuestions } = req.body;

    // Get existing attempts to calculate attempt number
    const existingAttempts = await prisma.quizAttempt.count({
      where: { userId, quizId },
    });

    const attemptNumber = existingAttempts + 1;

    // Calculate points awarded (simple rule: score × 10)
    const pointsAwarded = Math.floor(score * 10);

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create QuizAttempt
      const quizAttempt = await tx.quizAttempt.create({
        data: {
          userId,
          quizId,
          attemptNumber,
          score,
          pointsAwarded,
        },
      });

      // 2. Create PointsLedger entry
      await tx.pointsLedger.create({
        data: {
          userId,
          sourceType: "QUIZ",
          sourceId: quizId,
          points: pointsAwarded,
        },
      });

      // Get quiz to find courseId
      const quiz = await tx.quiz.findUnique({
        where: { id: quizId },
        select: { courseId: true, title: true },
      });

      // Fetch learner name for event metadata
      const learner = await tx.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      });

      // 3. Create Event (QUIZ_SUBMITTED)
      const event = await tx.event.create({
        data: {
          userId,
          courseId: quiz?.courseId,
          type: "QUIZ_SUBMITTED",
          metadata: JSON.stringify({
            quizId,
            quizTitle: quiz?.title,
            score,
            totalQuestions,
            attemptNumber,
            pointsAwarded,
            percentage: Math.round((score / totalQuestions) * 100),
            learnerName: learner?.name || 'Unknown',
            learnerEmail: learner?.email || '',
          }),
        },
      });

      // 4. Update CourseProgress if courseId exists
      if (quiz?.courseId) {
        // Get unique quiz IDs completed in this course
        const uniqueQuizAttempts = await tx.quizAttempt.findMany({
          where: {
            userId,
            quiz: {
              courseId: quiz.courseId,
            },
          },
          select: {
            quizId: true,
          },
        });

        // Count unique quizzes
        const uniqueQuizIds = new Set(uniqueQuizAttempts.map(a => a.quizId));
        const completedQuizzes = uniqueQuizIds.size;

        const totalQuizzes = await tx.quiz.count({
          where: { courseId: quiz.courseId },
        });

        // Get lessons info for progress
        const totalLessons = await tx.lesson.count({
          where: { courseId: quiz.courseId },
        });

        const completedLessons = await tx.lessonProgress.count({
          where: {
            userId,
            isCompleted: true,
            lesson: {
              courseId: quiz.courseId,
            },
          },
        });

        const progressPercentage =
          totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

        await tx.courseProgress.upsert({
          where: {
            userId_courseId: {
              userId,
              courseId: quiz.courseId,
            },
          },
          update: {
            quizzesCompleted: completedQuizzes,
            totalQuizzes,
            lastAccessedAt: new Date(),
          },
          create: {
            userId,
            courseId: quiz.courseId,
            lessonsCompleted: completedLessons,
            totalLessons,
            quizzesCompleted: completedQuizzes,
            totalQuizzes,
            progressPercentage,
          },
        });
      }

      return {
        quizAttempt,
        event,
      };
    });

    // Check for struggle insight after persisting
    const allAttempts = await prisma.quizAttempt.findMany({
      where: { userId, quizId },
      orderBy: { attemptedAt: "asc" },
    });

    const mapped = allAttempts.map(adapter.fromQuizAttempt);
    let timeSpent = 0;
    if (mapped.length > 1) {
      const first = new Date(mapped[0].attemptedAt);
      const last = new Date(mapped[mapped.length - 1].attemptedAt);
      timeSpent = Math.floor((last - first) / 1000);
    }

    const insightResult = insight.learnerStruggleInsight({
      attempts: mapped.length,
      timeSpent,
    });

    // Generate SMART performance insight
    const percentage = Math.round((score / totalQuestions) * 100);
    const performanceInsight = generatePerformanceInsight(percentage, attemptNumber, score, totalQuestions);

    const response = {
      success: true,
      attemptId: result.quizAttempt.id,
      pointsAwarded,
      attemptNumber,
      percentage,
      performanceInsight, // NEW: smart insight for frontend
    };

    if (insightResult.flag) {
      response.alert = fmt.formatAlert({
        ...insightResult,
        source: "quiz",
      });
    }

    res.json(response);
  } catch (err) {
    next(err);
  }
};

/**
 * Generate smart performance insights based on score, attempts, and patterns
 */
function generatePerformanceInsight(percentage, attemptNumber, score, totalQuestions) {
  let severity, title, message, recommendation, emoji;

  if (percentage <= 25) {
    severity = 'critical';
    emoji = '🚨';
    title = 'Needs Immediate Attention';
    message = `Scored ${score}/${totalQuestions} (${percentage}%). This indicates significant gaps in understanding.`;
    recommendation = attemptNumber >= 3
      ? 'Multiple low attempts detected. Consider revisiting the course material or reaching out to your instructor for help.'
      : 'Review the lesson materials carefully before reattempting. Focus on the core concepts covered in this module.';
  } else if (percentage <= 50) {
    severity = 'warning';
    emoji = '⚠️';
    title = 'Below Average Performance';
    message = `Scored ${score}/${totalQuestions} (${percentage}%). Some concepts need reinforcement.`;
    recommendation = attemptNumber >= 2
      ? 'Repeated below-average scores suggest specific knowledge gaps. Try re-reading the lesson notes and examples.'
      : 'You\'re getting there! Review the topics you missed and try again. Practice makes progress.';
  } else if (percentage <= 75) {
    severity = 'info';
    emoji = '📊';
    title = 'Good Progress';
    message = `Scored ${score}/${totalQuestions} (${percentage}%). Solid understanding with room to improve.`;
    recommendation = 'You have a good grasp of the material. Review the questions you missed to aim for mastery.';
  } else if (percentage <= 90) {
    severity = 'success';
    emoji = '✅';
    title = 'Strong Performance';
    message = `Scored ${score}/${totalQuestions} (${percentage}%). Excellent understanding of the material.`;
    recommendation = 'Great work! You\'re well on track. Consider helping peers who may be struggling.';
  } else {
    severity = 'excellent';
    emoji = '🏆';
    title = 'Outstanding!';
    message = `Scored ${score}/${totalQuestions} (${percentage}%). Near-perfect mastery demonstrated.`;
    recommendation = 'Exceptional performance! You\'ve mastered this material. Ready to move to the next module.';
  }

  // Add attempt-based context
  if (attemptNumber > 3 && percentage <= 50) {
    severity = 'critical';
    emoji = '🚨';
    title = 'Persistent Struggle Detected';
    recommendation = `${attemptNumber} attempts with low scores. Instructor attention recommended. Consider 1-on-1 support or alternative learning resources.`;
  }

  return { severity, emoji, title, message, recommendation, percentage, attemptNumber };
}

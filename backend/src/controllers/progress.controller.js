const progressService = require("../services/progress.service");

/**
 * Progress Controller
 * Handles HTTP requests for progress tracking
 */

/**
 * POST /api/progress/lesson/complete
 * Complete a lesson and update progress
 */
async function completeLessonController(req, res, next) {
  try {
    const { userId, lessonId, timeSpentSeconds } = req.body;

    if (!userId || !lessonId || timeSpentSeconds === undefined) {
      return res.status(400).json({
        error: "Missing required fields: userId, lessonId, timeSpentSeconds",
      });
    }

    if (typeof timeSpentSeconds !== "number" || timeSpentSeconds < 0) {
      return res.status(400).json({
        error: "timeSpentSeconds must be a non-negative number",
      });
    }

    const result = await progressService.completeLessonWithProgress(
      userId,
      lessonId,
      timeSpentSeconds
    );

    res.status(200).json({
      success: true,
      data: {
        lessonProgress: result.lessonProgress,
        courseProgress: {
          lessonsCompleted: result.courseProgress.lessonsCompleted,
          totalLessons: result.courseProgress.totalLessons,
          progressPercentage: result.courseProgress.progressPercentage,
        },
        event: result.event,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/progress/course/:courseId
 * Get course progress for a user
 */
async function getCourseProgressController(req, res, next) {
  try {
    const { courseId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: "Missing required query parameter: userId",
      });
    }

    const progress = await progressService.getCourseProgress(userId, courseId);

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/progress/user/:userId
 * Get all course progress for a user
 */
async function getAllUserProgressController(req, res, next) {
  try {
    const { userId } = req.params;

    const progress = await progressService.getAllUserCourseProgress(userId);

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  completeLessonController,
  getCourseProgressController,
  getAllUserProgressController,
};

const eventService = require("../services/event.service");

/**
 * Event Controller
 * Handles HTTP requests for event tracking
 */

/**
 * GET /api/events
 * Get events for a user with optional filtering
 */
async function getEventsController(req, res, next) {
  try {
    const { userId, limit, type, courseId, startDate, endDate } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: "Missing required query parameter: userId",
      });
    }

    const options = {
      limit: limit ? parseInt(limit, 10) : 50,
      type,
      courseId,
      startDate,
      endDate,
    };

    const events = await eventService.getUserEvents(userId, options);

    res.status(200).json({
      success: true,
      data: events,
      count: events.length,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/events/stats
 * Get event statistics for a user
 */
async function getEventStatsController(req, res, next) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: "Missing required query parameter: userId",
      });
    }

    const stats = await eventService.getEventStats(userId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/events
 * Create a new event
 */
async function createEventController(req, res, next) {
  try {
    const { userId, courseId, lessonId, type, metadata } = req.body;

    if (!userId || !type) {
      return res.status(400).json({
        error: "Missing required fields: userId, type",
      });
    }

    const validTypes = [
      "LESSON_COMPLETED",
      "QUIZ_SUBMITTED",
      "COURSE_COMPLETED",
      "COURSE_ENROLLED",
    ];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: `Invalid event type. Must be one of: ${validTypes.join(", ")}`,
      });
    }

    const event = await eventService.createEvent({
      userId,
      courseId,
      lessonId,
      type,
      metadata,
    });

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/events/instructor
 * Get events for all courses managed by an instructor
 */
async function getInstructorEventsController(req, res, next) {
  try {
    const { instructorId, limit, type, startDate, endDate } = req.query;

    if (!instructorId) {
      return res.status(400).json({
        error: "Missing required query parameter: instructorId",
      });
    }

    const options = {
      limit: limit ? parseInt(limit, 10) : 50,
      type,
      startDate,
      endDate,
    };

    const events = await eventService.getInstructorEvents(instructorId, options);

    res.status(200).json({
      success: true,
      data: events,
      count: events.length,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getEventsController,
  getInstructorEventsController,
  getEventStatsController,
  createEventController,
};

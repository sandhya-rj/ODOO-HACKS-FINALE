const prisma = require("../lib/prisma");

/**
 * Event Service
 * Handles system event tracking and retrieval
 */

/**
 * Get events for a user with optional filtering
 * @param {string} userId
 * @param {object} options - {limit, type, courseId, startDate, endDate}
 * @returns {Promise<Array>}
 */
async function getUserEvents(userId, options = {}) {
  const { limit = 50, type, courseId, startDate, endDate } = options;

  const where = { userId };

  if (type) {
    where.type = type;
  }

  if (courseId) {
    where.courseId = courseId;
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      where.createdAt.lte = new Date(endDate);
    }
  }

  return await prisma.event.findMany({
    where,
    include: {
      course: {
        select: {
          id: true,
          title: true,
        },
      },
      lesson: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
}

/**
 * Create a new event
 * @param {object} eventData - {userId, courseId?, lessonId?, type, metadata?}
 * @returns {Promise<object>}
 */
async function createEvent(eventData) {
  const { userId, courseId, lessonId, type, metadata } = eventData;

  return await prisma.event.create({
    data: {
      userId,
      courseId: courseId || null,
      lessonId: lessonId || null,
      type,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });
}

/**
 * Get event statistics for a user
 * @param {string} userId
 * @returns {Promise<object>}
 */
async function getEventStats(userId) {
  const events = await prisma.event.findMany({
    where: { userId },
    select: { type: true },
  });

  const stats = events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {});

  return {
    totalEvents: events.length,
    byType: stats,
  };
}

/**
 * Get events for all courses managed by an instructor
 * @param {string} instructorId
 * @param {object} options - {limit, type, startDate, endDate}
 * @returns {Promise<Array>}
 */
async function getInstructorEvents(instructorId, options = {}) {
  const { limit = 50, type, startDate, endDate } = options;

  // First, get all courses where this instructor is the courseAdmin
  const instructorCourses = await prisma.course.findMany({
    where: { courseAdminId: instructorId },
    select: { id: true },
  });

  const courseIds = instructorCourses.map((c) => c.id);

  if (courseIds.length === 0) {
    return [];
  }

  const where = {
    courseId: {
      in: courseIds,
    },
  };

  if (type) {
    where.type = type;
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      where.createdAt.lte = new Date(endDate);
    }
  }

  const events = await prisma.event.findMany({
    where,
    include: {
      course: {
        select: {
          id: true,
          title: true,
        },
      },
      lesson: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  return events;
}

module.exports = {
  getUserEvents,
  getInstructorEvents,
  createEvent,
  getEventStats,
};

const prisma = require("../lib/prisma");

/**
 * Notification Service
 * Handles user notifications
 */

/**
 * Get notifications for a user
 * @param {string} userId
 * @param {object} options - {status, limit}
 * @returns {Promise<Array>}
 */
async function getUserNotifications(userId, options = {}) {
  const { status, limit = 50 } = options;

  const where = { userId };

  if (status) {
    where.status = status;
  }

  return await prisma.notification.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
}

/**
 * Mark notification as read
 * @param {string} notificationId
 * @param {string} userId - for authorization
 * @returns {Promise<object>}
 */
async function markAsRead(notificationId, userId) {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  if (notification.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return await prisma.notification.update({
    where: { id: notificationId },
    data: {
      status: "READ",
      readAt: new Date(),
    },
  });
}

/**
 * Mark notification as dismissed
 * @param {string} notificationId
 * @param {string} userId - for authorization
 * @returns {Promise<object>}
 */
async function dismissNotification(notificationId, userId) {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  if (notification.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return await prisma.notification.update({
    where: { id: notificationId },
    data: {
      status: "DISMISSED",
    },
  });
}

/**
 * Create a notification
 * @param {object} notificationData - {userId, title, message, eventId?}
 * @returns {Promise<object>}
 */
async function createNotification(notificationData) {
  const { userId, title, message, eventId } = notificationData;

  return await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      eventId: eventId || null,
    },
  });
}

/**
 * Get unread notification count
 * @param {string} userId
 * @returns {Promise<number>}
 */
async function getUnreadCount(userId) {
  return await prisma.notification.count({
    where: {
      userId,
      status: "UNREAD",
    },
  });
}

module.exports = {
  getUserNotifications,
  markAsRead,
  dismissNotification,
  createNotification,
  getUnreadCount,
};

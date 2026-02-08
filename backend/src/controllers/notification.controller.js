const notificationService = require("../services/notification.service");

/**
 * Notification Controller
 * Handles HTTP requests for user notifications
 */

/**
 * GET /api/notifications
 * Get notifications for a user
 */
async function getNotificationsController(req, res, next) {
  try {
    const { userId, status, limit } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: "Missing required query parameter: userId",
      });
    }

    const options = {
      status,
      limit: limit ? parseInt(limit, 10) : 50,
    };

    const notifications = await notificationService.getUserNotifications(
      userId,
      options
    );

    res.status(200).json({
      success: true,
      data: notifications,
      count: notifications.length,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/notifications/unread-count
 * Get unread notification count
 */
async function getUnreadCountController(req, res, next) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: "Missing required query parameter: userId",
      });
    }

    const count = await notificationService.getUnreadCount(userId);

    res.status(200).json({
      success: true,
      data: { unreadCount: count },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/notifications/:id/read
 * Mark notification as read
 */
async function markAsReadController(req, res, next) {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "Missing required field: userId",
      });
    }

    const notification = await notificationService.markAsRead(id, userId);

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    if (error.message === "Notification not found") {
      return res.status(404).json({ error: "Notification not found" });
    }
    next(error);
  }
}

/**
 * PATCH /api/notifications/:id/dismiss
 * Mark notification as dismissed
 */
async function dismissNotificationController(req, res, next) {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "Missing required field: userId",
      });
    }

    const notification = await notificationService.dismissNotification(
      id,
      userId
    );

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    if (error.message === "Notification not found") {
      return res.status(404).json({ error: "Notification not found" });
    }
    next(error);
  }
}

module.exports = {
  getNotificationsController,
  getUnreadCountController,
  markAsReadController,
  dismissNotificationController,
};

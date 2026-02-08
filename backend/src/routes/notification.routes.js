const express = require("express");
const router = express.Router();
const {
  getNotificationsController,
  getUnreadCountController,
  markAsReadController,
  dismissNotificationController,
} = require("../controllers/notification.controller");

/**
 * Notification Routes
 * Base path: /api/notifications
 */

// Get notifications for a user
router.get("/", getNotificationsController);

// Get unread notification count
router.get("/unread-count", getUnreadCountController);

// Mark notification as read
router.patch("/:id/read", markAsReadController);

// Mark notification as dismissed
router.patch("/:id/dismiss", dismissNotificationController);

module.exports = router;

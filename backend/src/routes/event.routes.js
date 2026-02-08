const express = require("express");
const router = express.Router();
const {
  getEventsController,
  getInstructorEventsController,
  getEventStatsController,
  createEventController,
} = require("../controllers/event.controller");

/**
 * Event Routes
 * Base path: /api/events
 */

// Get events for all courses managed by an instructor
router.get("/instructor", getInstructorEventsController);

// Get events for a user (with optional filters)
router.get("/", getEventsController);

// Get event statistics
router.get("/stats", getEventStatsController);

// Create a new event
router.post("/", createEventController);

module.exports = router;

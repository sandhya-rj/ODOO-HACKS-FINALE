const express = require("express");
const router = express.Router();
const {
  completeLessonController,
  getCourseProgressController,
  getAllUserProgressController,
} = require("../controllers/progress.controller");

/**
 * Progress Routes
 * Base path: /api/progress
 */

// Complete a lesson
router.post("/lesson/complete", completeLessonController);

// Get course progress for a user
router.get("/course/:courseId", getCourseProgressController);

// Get all course progress for a user
router.get("/user/:userId", getAllUserProgressController);

module.exports = router;

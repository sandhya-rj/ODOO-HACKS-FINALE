const express = require("express");
const router = express.Router();
const leaderboardController = require("../controllers/leaderboard.controller");

/**
 * GET /api/leaderboard/top-learners
 * Returns top 5 learners ranked by total points
 */
router.get("/top-learners", leaderboardController.getTopLearners);

module.exports = router;

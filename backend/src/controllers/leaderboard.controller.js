const leaderboardService = require("../services/leaderboard.service");

/**
 * GET /api/leaderboard/top-learners
 * Returns top 5 learners ranked by points
 */
const getTopLearners = async (req, res, next) => {
  try {
    const topLearners = await leaderboardService.getTopLearners();

    res.json({
      success: true,
      data: topLearners,
      count: topLearners.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTopLearners,
};

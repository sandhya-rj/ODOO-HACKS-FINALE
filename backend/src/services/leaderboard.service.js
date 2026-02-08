const prisma = require("../lib/prisma");

/**
 * Get top learners ranked by total points
 * Aggregates points from PointsLedger and completed courses from CourseProgress
 * @returns {Promise<Array>} Top 5 learners with rank, points, and completed courses
 */
const getTopLearners = async () => {
  try {
    // Get all users with their total points and completed courses
    const users = await prisma.user.findMany({
      where: {
        role: "LEARNER", // Only learners, not instructors/admins
      },
      select: {
        id: true,
        name: true,
        email: true,
        pointsLedger: {
          select: {
            points: true,
          },
        },
        courseProgress: {
          where: {
            progressPercentage: 100, // Only completed courses
          },
          select: {
            id: true,
          },
        },
      },
    });

    // Transform and calculate totals
    const leaderboard = users.map((user) => {
      const totalPoints = user.pointsLedger.reduce(
        (sum, entry) => sum + entry.points,
        0
      );
      const completedCourses = user.courseProgress.length;

      return {
        userId: user.id,
        name: user.name,
        email: user.email,
        totalPoints,
        completedCourses,
      };
    });

    // Sort by totalPoints DESC, then completedCourses DESC (tiebreaker)
    leaderboard.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      return b.completedCourses - a.completedCourses;
    });

    // Add rank and limit to top 5
    const topLearners = leaderboard.slice(0, 5).map((learner, index) => ({
      ...learner,
      rank: index + 1,
    }));

    return topLearners;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw new Error("Failed to fetch leaderboard data");
  }
};

module.exports = {
  getTopLearners,
};

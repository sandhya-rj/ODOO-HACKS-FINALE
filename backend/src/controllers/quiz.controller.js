const prisma = require("../lib/prisma");
const adapter = require("../services/insightDataAdapter.service");
const insight = require("../services/insight.service");
const fmt = require("../services/alertFormatter.service");

exports.submitQuiz = async (req, res, next) => {
  try {
    const { userId, quizId } = req.body;

    const attemptRows = await prisma.quizAttempt.findMany({
      where: { userId, quizId },
      orderBy: { attemptedAt: "asc" },
    });

    // Adapter maps each row; aggregate for insight engine
    const mapped = attemptRows.map(adapter.fromQuizAttempt);
    const totalAttempts = mapped.length;

    // Calculate total time span across attempts
    let timeSpent = 0;
    if (mapped.length > 1) {
      const first = new Date(mapped[0].attemptedAt);
      const last = new Date(mapped[mapped.length - 1].attemptedAt);
      timeSpent = Math.floor((last - first) / 1000);
    }

    const result = insight.learnerStruggleInsight({
      attempts: totalAttempts,
      timeSpent,
    });

    if (result.flag) {
      return res.json({
        submitted: true,
        alert: fmt.formatAlert({
          ...result,
          source: "quiz",
        }),
      });
    }

    res.json({ submitted: true });
  } catch (err) {
    next(err);
  }
};

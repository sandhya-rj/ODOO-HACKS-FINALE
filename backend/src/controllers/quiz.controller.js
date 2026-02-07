const insight = require("../services/insight.service");
const fmt = require("../services/alertFormatter.service");

exports.submitQuiz = async (req, res) => {
  const { attempts, score, timeSpent } = req.body;

  // TODO: replace req.body with adapter-mapped DB record
  // const quizData = adapter.fromQuizAttempt(dbRecord);

  // existing submit logic (stub or real)

  const insightResult = insight.learnerStruggleInsight({ attempts, timeSpent });

  if (insightResult.flag) {
    return res.json({
      submitted: true,
      alert: fmt.formatAlert({
        ...insightResult,
        source: "quiz",
      }),
    });
  }

  res.json({ submitted: true });
};

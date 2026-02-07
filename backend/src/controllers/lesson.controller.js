const insight = require("../services/insight.service");
const fmt = require("../services/alertFormatter.service");

exports.completeLesson = (req, res) => {
  const { timeSpent, expectedTime } = req.body;

  const pace = insight.lessonPacingInsight({
    timeSpent,
    expectedTime,
  });

  if (pace.flag) {
    return res.json({
      completed: true,
      alert: fmt.formatAlert({
        ...pace,
        source: "lesson",
      }),
    });
  }

  res.json({ completed: true });
};

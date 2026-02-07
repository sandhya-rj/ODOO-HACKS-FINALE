const svc = require("../services/insight.service");

exports.testLessonInsight = (req, res) => {
  const result = svc.lessonDifficultyInsight(req.body.attempts);
  res.json(result);
};

exports.testLearnerInsight = (req, res) => {
  const result = svc.learnerStruggleInsight(req.body);
  res.json(result);
};

exports.mockRiskBatch = (req, res) => {
  const fmt = require("../services/alertFormatter.service");

  const samples = [
    svc.learnerStruggleInsight({ attempts: 3, timeSpent: 2000 }),
    svc.lessonPacingInsight({ timeSpent: 900, expectedTime: 300 }),
    svc.courseDropoffInsight([0.3, 0.4, 0.9]),
  ];

  const alerts = samples
    .filter((x) => x.flag)
    .map((x) => fmt.formatAlert({ ...x, source: "mock" }));

  res.json({ alerts });
};

exports.validateQuizSubmit = (req, res, next) => {
  const { attempts, timeSpent } = req.body;

  if (typeof attempts !== "number" || typeof timeSpent !== "number") {
    return res.status(400).json({
      error: "attempts and timeSpent must be numbers",
    });
  }

  next();
};

exports.validateLessonComplete = (req, res, next) => {
  const { timeSpent, expectedTime } = req.body;

  if (!timeSpent || !expectedTime) {
    return res.status(400).json({
      error: "timeSpent and expectedTime required",
    });
  }

  next();
};

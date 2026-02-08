exports.validateQuizSubmit = (req, res, next) => {
  const { userId, quizId, score, totalQuestions } = req.body;

  if (!userId || !quizId) {
    return res.status(400).json({
      error: "userId and quizId are required",
    });
  }

  if (score === undefined || totalQuestions === undefined) {
    return res.status(400).json({
      error: "score and totalQuestions are required",
    });
  }

  if (typeof score !== "number" || typeof totalQuestions !== "number") {
    return res.status(400).json({
      error: "score and totalQuestions must be numbers",
    });
  }

  if (score < 0 || totalQuestions < 1) {
    return res.status(400).json({
      error: "Invalid score or totalQuestions values",
    });
  }

  next();
};

exports.validateLessonComplete = (req, res, next) => {
  const { userId, lessonId } = req.body;

  if (!userId || !lessonId) {
    return res.status(400).json({
      error: "userId and lessonId are required",
    });
  }

  next();
};

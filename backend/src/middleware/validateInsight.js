exports.validateQuizSubmit = (req, res, next) => {
  const { userId, quizId } = req.body;

  if (!userId || !quizId) {
    return res.status(400).json({
      error: "userId and quizId are required",
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

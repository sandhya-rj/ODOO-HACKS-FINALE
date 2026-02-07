// This layer converts DB models → insight inputs
// No DB code yet — just shape mapping

exports.fromQuizAttempt = (quizRecord) => ({
  attempts: quizRecord.attempts,
  timeSpent: quizRecord.timeSpent,
});

exports.fromLessonProgress = (lessonRecord) => ({
  timeSpent: lessonRecord.timeSpent,
  expectedTime: lessonRecord.expectedTime,
});

exports.fromCourseStats = (stats) => ({
  rates: stats.lessonCompletionRates,
});

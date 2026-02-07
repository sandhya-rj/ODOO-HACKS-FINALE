exports.fromQuizAttempt = (row) => ({
  attempts: row.attemptNumber,
  score: row.score,
  points: row.pointsAwarded,
  userId: row.userId,
  quizId: row.quizId,
  attemptedAt: row.attemptedAt
});

exports.fromLessonProgress = (row) => ({
  userId: row.userId,
  lessonId: row.lessonId,
  completed: row.isCompleted,
  timeSpent: row.timeSpentSeconds,
  completedAt: row.completedAt
});

exports.fromCourseStats = (enrollment, lessonProgressRows, totalLessons) => {
  const completed = lessonProgressRows.filter(x => x.isCompleted).length;
  const completionRate =
    totalLessons === 0 ? 0 : completed / totalLessons;

  return {
    userId: enrollment.userId,
    courseId: enrollment.courseId,
    enrollmentStatus: enrollment.status,
    completionRate
  };
};

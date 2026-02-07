exports.analyzeQuizAttempt = async (payload) => {
  const { attempts, score } = payload;

  if (attempts >= 3 && score < 50) {
    return {
      alert: true,
      type: "MULTI_FAIL",
      message: "Learner struggling",
    };
  }

  return { alert: false };
};

exports.lessonDifficultyInsight = (quizAttempts) => {
  const avgAttempts =
    quizAttempts.reduce((a, b) => a + b, 0) / quizAttempts.length;

  if (avgAttempts > 2) {
    return {
      flag: true,
      type: "LESSON_DIFFICULT",
      message: "Average attempts > 2",
    };
  }

  return { flag: false };
};

exports.learnerStruggleInsight = ({ attempts, timeSpent }) => {
  if (attempts >= 3 || timeSpent > 1800) {
    return {
      flag: true,
      type: "LEARNER_STRUGGLE",
      message: "High retries or time spent",
    };
  }

  return { flag: false };
};

exports.lessonPacingInsight = ({ timeSpent, expectedTime }) => {
  if (timeSpent > expectedTime * 1.8) {
    return {
      flag: true,
      type: "LESSON_PACING_SLOW",
      message: "Learner taking unusually long",
    };
  }

  if (timeSpent < expectedTime * 0.3) {
    return {
      flag: true,
      type: "LESSON_PACING_FAST",
      message: "Lesson likely skipped",
    };
  }

  return { flag: false };
};

exports.courseDropoffInsight = (lessonCompletionRates) => {
  const low = lessonCompletionRates.filter((r) => r < 0.5);

  if (low.length >= 2) {
    return {
      flag: true,
      type: "COURSE_DROPOFF",
      message: "Multiple lessons below 50% completion",
    };
  }

  return { flag: false };
};

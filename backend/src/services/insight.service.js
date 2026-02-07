const config = require("../config/insight.config");

exports.analyzeQuizAttempt = async (payload) => {
  const { attempts, score } = payload;

  if (attempts >= config.STRUGGLE_ATTEMPTS && score < 50) {
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

  if (avgAttempts > config.LESSON_DIFFICULTY_THRESHOLD) {
    return {
      flag: true,
      type: "LESSON_DIFFICULT",
      message: "Average attempts > 2",
    };
  }

  return { flag: false };
};

exports.learnerStruggleInsight = ({ attempts, timeSpent }) => {
  if (attempts >= config.STRUGGLE_ATTEMPTS || timeSpent > config.STRUGGLE_TIME) {
    return {
      flag: true,
      type: "LEARNER_STRUGGLE",
      message: "High retries or time spent",
    };
  }

  return { flag: false };
};

exports.lessonPacingInsight = ({ timeSpent, expectedTime }) => {
  if (timeSpent > expectedTime * config.PACING_SLOW_FACTOR) {
    return {
      flag: true,
      type: "LESSON_PACING_SLOW",
      message: "Learner taking unusually long",
    };
  }

  if (timeSpent < expectedTime * config.PACING_FAST_FACTOR) {
    return {
      flag: true,
      type: "LESSON_PACING_FAST",
      message: "Lesson likely skipped",
    };
  }

  return { flag: false };
};

exports.courseDropoffInsight = (lessonCompletionRates) => {
  const low = lessonCompletionRates.filter((r) => r < config.COURSE_DROPOFF_RATE);

  if (low.length >= config.COURSE_DROPOFF_MIN_LESSONS) {
    return {
      flag: true,
      type: "COURSE_DROPOFF",
      message: "Multiple lessons below 50% completion",
    };
  }

  return { flag: false };
};

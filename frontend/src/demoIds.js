/**
 * Frontend Demo IDs - Direct from Seed Data
 * 
 * @source backend/prisma/seed.js (UNCHANGED)
 * @date February 7, 2026
 * @note Replace variable names with actual UUIDs from your seeded database
 */

export const DEMO_IDS = {
  // ========================
  // USERS
  // ========================
  users: {
    // Struggling learner - 3 quiz attempts, slow pacing
    strugglingLearner: {
      id: 'learner4.id', // Noah Davis
      email: 'noah.davis@student.com',
      name: 'Noah Davis',
      role: 'LEARNER',
      useCase: 'Test LEARNER_STRUGGLE and LESSON_PACING_SLOW alerts'
    },
    
    // Successful learner - completed course, 100% quiz
    successfulLearner: {
      id: 'learner1.id', // Emma Wilson
      email: 'emma.wilson@student.com',
      name: 'Emma Wilson',
      role: 'LEARNER',
      useCase: 'Test normal/successful learner flow'
    },
    
    // Improving learner - 2 attempts with improvement
    improvingLearner: {
      id: 'learner2.id', // James Martinez
      email: 'james.martinez@student.com',
      name: 'James Martinez',
      role: 'LEARNER',
      useCase: 'Test learner improvement pattern'
    },
    
    // New learner - minimal progress
    newLearner: {
      id: 'learner3.id', // Olivia Brown
      email: 'olivia.brown@student.com',
      name: 'Olivia Brown',
      role: 'LEARNER',
      useCase: 'Test yet-to-start scenarios'
    },
    
    // Instructor - course admin
    instructor: {
      id: 'instructor.id', // Michael Chen
      email: 'michael.chen@learnsphere.com',
      name: 'Michael Chen',
      role: 'INSTRUCTOR',
      useCase: 'Test instructor dashboard and analytics'
    },
    
    // Admin
    admin: {
      id: 'admin.id', // Sarah Johnson
      email: 'admin@learnsphere.com',
      name: 'Sarah Johnson',
      role: 'ADMIN',
      useCase: 'Test admin features'
    }
  },

  // ========================
  // COURSES
  // ========================
  courses: {
    javascriptFundamentals: {
      id: 'course-javascript-fundamentals',
      title: 'JavaScript Fundamentals',
      triggersDropoff: true, // Has 3 lessons below 50% completion
      enrolledCount: 3
    },
    
    reactEssentials: {
      id: 'course-react-essentials',
      title: 'React Essentials',
      triggersDropoff: true, // Has 3 lessons below 50% completion
      enrolledCount: 2
    }
  },

  // ========================
  // QUIZZES
  // ========================
  quizzes: {
    jsFundamentals: {
      id: 'quiz-js-fundamentals',
      courseId: 'course-javascript-fundamentals',
      title: 'JavaScript Fundamentals Assessment',
      hasStruggleData: true // learner4 has 3 attempts
    },
    
    reactEssentials: {
      id: 'quiz-react-essentials',
      courseId: 'course-react-essentials',
      title: 'React Essentials Assessment'
    }
  },

  // ========================
  // LESSONS - JAVASCRIPT COURSE
  // ========================
  lessons: {
    javascriptCourse: {
      intro: {
        id: 'lesson-js-intro',
        courseId: 'course-javascript-fundamentals',
        title: 'Introduction to JavaScript',
        type: 'VIDEO',
        durationSeconds: 840,
        position: 1,
        // PACING_SLOW triggers at: 840 * 1.8 = 1512s
        // PACING_FAST triggers at: 840 * 0.3 = 252s
        hasSlowPacingData: true // learner4: 1800s
      },
      
      variables: {
        id: 'lesson-js-variables',
        courseId: 'course-javascript-fundamentals',
        title: 'Variables and Data Types',
        type: 'VIDEO',
        durationSeconds: 1020,
        position: 2,
        // PACING_SLOW triggers at: 1020 * 1.8 = 1836s
        // PACING_FAST triggers at: 1020 * 0.3 = 306s
        hasSlowPacingData: true // learner4: 2400s
      },
      
      functions: {
        id: 'lesson-js-functions',
        courseId: 'course-javascript-fundamentals',
        title: 'Functions and Scope',
        type: 'DOCUMENT',
        durationSeconds: null,
        position: 3,
        completionRate: 0.33 // 1/3 - triggers dropoff
      },
      
      objects: {
        id: 'lesson-js-objects',
        courseId: 'course-javascript-fundamentals',
        title: 'Objects and Arrays',
        type: 'VIDEO',
        durationSeconds: 1260,
        position: 4,
        completionRate: 0.33 // 1/3 - triggers dropoff
      },
      
      es6: {
        id: 'lesson-js-es6',
        courseId: 'course-javascript-fundamentals',
        title: 'ES6+ Modern Features',
        type: 'VIDEO',
        durationSeconds: 1440,
        position: 5,
        completionRate: 0.33 // 1/3 - triggers dropoff
      }
    },

    // ========================
    // LESSONS - REACT COURSE
    // ========================
    reactCourse: {
      intro: {
        id: 'lesson-react-intro',
        courseId: 'course-react-essentials',
        title: 'Getting Started with React',
        type: 'VIDEO',
        durationSeconds: 960,
        position: 1
      },
      
      components: {
        id: 'lesson-react-components',
        courseId: 'course-react-essentials',
        title: 'Components and Props',
        type: 'VIDEO',
        durationSeconds: 1140,
        position: 2
      },
      
      state: {
        id: 'lesson-react-state',
        courseId: 'course-react-essentials',
        title: 'State Management with Hooks',
        type: 'DOCUMENT',
        durationSeconds: null,
        position: 3,
        completionRate: 0 // 0/2 - triggers dropoff
      },
      
      effects: {
        id: 'lesson-react-effects',
        courseId: 'course-react-essentials',
        title: 'Side Effects and useEffect',
        type: 'VIDEO',
        durationSeconds: 1320,
        position: 4,
        completionRate: 0 // 0/2 - triggers dropoff
      },
      
      advanced: {
        id: 'lesson-react-advanced',
        courseId: 'course-react-essentials',
        title: 'Advanced Patterns',
        type: 'IMAGE',
        durationSeconds: null,
        position: 5,
        completionRate: 0 // 0/2 - triggers dropoff
      }
    }
  }
};

// ========================
// INSIGHT THRESHOLDS
// ========================
export const INSIGHT_THRESHOLDS = {
  STRUGGLE_ATTEMPTS: 3,
  STRUGGLE_TIME: 1800, // seconds
  PACING_SLOW_FACTOR: 1.8,
  PACING_FAST_FACTOR: 0.3,
  COURSE_DROPOFF_RATE: 0.5, // 50%
  COURSE_DROPOFF_MIN_LESSONS: 2
};

// ========================
// DEMO PAYLOADS
// ========================
export const DEMO_PAYLOADS = {
  // Guaranteed to trigger LEARNER_STRUGGLE
  quizSubmit_TriggerStruggle: {
    userId: DEMO_IDS.users.strugglingLearner.id,
    quizId: DEMO_IDS.quizzes.jsFundamentals.id,
    attemptNumber: 4, // Noah already has 3 attempts
    score: 33.33,
    answers: [
      { questionId: 'q1-question-1', selectedOptionId: 'q1q1-opt1' },
      { questionId: 'q1-question-2', selectedOptionId: 'q1q2-opt1' },
      { questionId: 'q1-question-3', selectedOptionId: 'q1q3-opt1' }
    ]
  },

  // Guaranteed to trigger LESSON_PACING_SLOW
  lessonComplete_TriggerSlowPacing: {
    userId: DEMO_IDS.users.strugglingLearner.id,
    lessonId: DEMO_IDS.lessons.javascriptCourse.intro.id,
    timeSpentSeconds: 2000, // > 840 * 1.8 = 1512
    isCompleted: true
  },

  // Alternative slow pacing payload
  lessonComplete_TriggerSlowPacing_Alt: {
    userId: DEMO_IDS.users.strugglingLearner.id,
    lessonId: DEMO_IDS.lessons.javascriptCourse.variables.id,
    timeSpentSeconds: 2500, // > 1020 * 1.8 = 1836
    isCompleted: false
  },

  // Normal lesson completion (no alerts)
  lessonComplete_Normal: {
    userId: DEMO_IDS.users.successfulLearner.id,
    lessonId: DEMO_IDS.lessons.reactCourse.state.id,
    timeSpentSeconds: 600,
    isCompleted: true
  },

  // Successful quiz attempt (no alerts)
  quizSubmit_Normal: {
    userId: DEMO_IDS.users.successfulLearner.id,
    quizId: DEMO_IDS.quizzes.reactEssentials.id,
    attemptNumber: 1,
    score: 100,
    answers: [
      { questionId: 'q2-question-1', selectedOptionId: 'q2q1-opt2' },
      { questionId: 'q2-question-2', selectedOptionId: 'q2q2-opt2' },
      { questionId: 'q2-question-3', selectedOptionId: 'q2q3-opt2' }
    ]
  }
};

// ========================
// HELPER FUNCTIONS
// ========================

/**
 * Calculate if a time spent triggers PACING_SLOW
 */
export function willTriggerSlowPacing(timeSpentSeconds, expectedSeconds) {
  const threshold = expectedSeconds * INSIGHT_THRESHOLDS.PACING_SLOW_FACTOR;
  return timeSpentSeconds > threshold;
}

/**
 * Calculate if a time spent triggers PACING_FAST
 */
export function willTriggerFastPacing(timeSpentSeconds, expectedSeconds) {
  const threshold = expectedSeconds * INSIGHT_THRESHOLDS.PACING_FAST_FACTOR;
  return timeSpentSeconds < threshold;
}

/**
 * Check if attempts trigger LEARNER_STRUGGLE
 */
export function willTriggerStruggleByAttempts(attemptCount) {
  return attemptCount >= INSIGHT_THRESHOLDS.STRUGGLE_ATTEMPTS;
}

/**
 * Check if time triggers LEARNER_STRUGGLE
 */
export function willTriggerStruggleByTime(timeSpentSeconds) {
  return timeSpentSeconds > INSIGHT_THRESHOLDS.STRUGGLE_TIME;
}

// ========================
// EXAMPLE USAGE
// ========================

/*
// Import in your component
import { DEMO_IDS, DEMO_PAYLOADS, willTriggerSlowPacing } from './demoIds';

// Test struggling learner flow
const strugglingUser = DEMO_IDS.users.strugglingLearner.id;

// Submit quiz that triggers alert
await api.post('/quiz/submit', DEMO_PAYLOADS.quizSubmit_TriggerStruggle);

// Complete lesson that triggers slow pacing alert
await api.post('/lesson/complete', DEMO_PAYLOADS.lessonComplete_TriggerSlowPacing);

// Check if custom time will trigger
const willTrigger = willTriggerSlowPacing(2000, 840); // true

// Get course insights (will show COURSE_DROPOFF)
const insights = await api.get(`/insights/course/${DEMO_IDS.courses.javascriptFundamentals.id}`);
*/

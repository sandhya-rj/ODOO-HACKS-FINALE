require('dotenv/config');
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient({});

async function main() {
  console.log('Starting seed...');

  // USERS
  const admin = await prisma.user.upsert({
    where: { email: 'admin@learnsphere.com' },
    update: {},
    create: {
      name: 'Sarah Johnson',
      email: 'admin@learnsphere.com',
      password: '$2b$10$rKjXZ8QhF5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J',
      role: 'ADMIN',
    },
  });

  const instructor = await prisma.user.upsert({
    where: { email: 'michael.chen@learnsphere.com' },
    update: {},
    create: {
      name: 'Michael Chen',
      email: 'michael.chen@learnsphere.com',
      password: '$2b$10$rKjXZ8QhF5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J',
      role: 'INSTRUCTOR',
    },
  });

  const learner1 = await prisma.user.upsert({
    where: { email: 'emma.wilson@student.com' },
    update: {},
    create: {
      name: 'Emma Wilson',
      email: 'emma.wilson@student.com',
      password: '$2b$10$rKjXZ8QhF5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J',
      role: 'LEARNER',
    },
  });

  const learner2 = await prisma.user.upsert({
    where: { email: 'james.martinez@student.com' },
    update: {},
    create: {
      name: 'James Martinez',
      email: 'james.martinez@student.com',
      password: '$2b$10$rKjXZ8QhF5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J',
      role: 'LEARNER',
    },
  });

  const learner3 = await prisma.user.upsert({
    where: { email: 'olivia.brown@student.com' },
    update: {},
    create: {
      name: 'Olivia Brown',
      email: 'olivia.brown@student.com',
      password: '$2b$10$rKjXZ8QhF5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J',
      role: 'LEARNER',
    },
  });

  const learner4 = await prisma.user.upsert({
    where: { email: 'noah.davis@student.com' },
    update: {},
    create: {
      name: 'Noah Davis',
      email: 'noah.davis@student.com',
      password: '$2b$10$rKjXZ8QhF5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J5K5J',
      role: 'LEARNER',
    },
  });

  console.log('Users created');

  // COURSES
  const course1 = await prisma.course.upsert({
    where: { id: 'course-javascript-fundamentals' },
    update: {},
    create: {
      id: 'course-javascript-fundamentals',
      title: 'JavaScript Fundamentals',
      description: 'Master the core concepts of JavaScript programming. Learn variables, functions, objects, arrays, and modern ES6+ features. Perfect for beginners looking to build a strong foundation in web development.',
      imageUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a',
      visibility: 'SIGNED_IN',
      accessRule: 'OPEN',
      isPublished: true,
      courseAdminId: instructor.id,
    },
  });

  const course2 = await prisma.course.upsert({
    where: { id: 'course-react-essentials' },
    update: {},
    create: {
      id: 'course-react-essentials',
      title: 'React Essentials',
      description: 'Build modern, interactive user interfaces with React. Explore components, hooks, state management, and best practices for creating scalable React applications. Includes hands-on projects and real-world examples.',
      imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
      visibility: 'SIGNED_IN',
      accessRule: 'OPEN',
      isPublished: true,
      courseAdminId: instructor.id,
    },
  });

  console.log('Courses created');

  // LESSONS - Course 1
  const course1Lesson1 = await prisma.lesson.upsert({
    where: { id: 'lesson-js-intro' },
    update: {},
    create: {
      id: 'lesson-js-intro',
      courseId: course1.id,
      title: 'Introduction to JavaScript',
      type: 'VIDEO',
      contentUrl: 'https://videos.learnsphere.com/js-intro.mp4',
      durationSeconds: 840,
      position: 1,
    },
  });

  const course1Lesson2 = await prisma.lesson.upsert({
    where: { id: 'lesson-js-variables' },
    update: {},
    create: {
      id: 'lesson-js-variables',
      courseId: course1.id,
      title: 'Variables and Data Types',
      type: 'VIDEO',
      contentUrl: 'https://videos.learnsphere.com/js-variables.mp4',
      durationSeconds: 1020,
      position: 2,
    },
  });

  const course1Lesson3 = await prisma.lesson.upsert({
    where: { id: 'lesson-js-functions' },
    update: {},
    create: {
      id: 'lesson-js-functions',
      courseId: course1.id,
      title: 'Functions and Scope',
      type: 'DOCUMENT',
      contentUrl: 'https://docs.learnsphere.com/js-functions.pdf',
      durationSeconds: null,
      position: 3,
    },
  });

  const course1Lesson4 = await prisma.lesson.upsert({
    where: { id: 'lesson-js-objects' },
    update: {},
    create: {
      id: 'lesson-js-objects',
      courseId: course1.id,
      title: 'Objects and Arrays',
      type: 'VIDEO',
      contentUrl: 'https://videos.learnsphere.com/js-objects.mp4',
      durationSeconds: 1260,
      position: 4,
    },
  });

  const course1Lesson5 = await prisma.lesson.upsert({
    where: { id: 'lesson-js-es6' },
    update: {},
    create: {
      id: 'lesson-js-es6',
      courseId: course1.id,
      title: 'ES6+ Modern Features',
      type: 'VIDEO',
      contentUrl: 'https://videos.learnsphere.com/js-es6.mp4',
      durationSeconds: 1440,
      position: 5,
    },
  });

  // LESSONS - Course 2
  const course2Lesson1 = await prisma.lesson.upsert({
    where: { id: 'lesson-react-intro' },
    update: {},
    create: {
      id: 'lesson-react-intro',
      courseId: course2.id,
      title: 'Getting Started with React',
      type: 'VIDEO',
      contentUrl: 'https://videos.learnsphere.com/react-intro.mp4',
      durationSeconds: 960,
      position: 1,
    },
  });

  const course2Lesson2 = await prisma.lesson.upsert({
    where: { id: 'lesson-react-components' },
    update: {},
    create: {
      id: 'lesson-react-components',
      courseId: course2.id,
      title: 'Components and Props',
      type: 'VIDEO',
      contentUrl: 'https://videos.learnsphere.com/react-components.mp4',
      durationSeconds: 1140,
      position: 2,
    },
  });

  const course2Lesson3 = await prisma.lesson.upsert({
    where: { id: 'lesson-react-state' },
    update: {},
    create: {
      id: 'lesson-react-state',
      courseId: course2.id,
      title: 'State Management with Hooks',
      type: 'DOCUMENT',
      contentUrl: 'https://docs.learnsphere.com/react-state.pdf',
      durationSeconds: null,
      position: 3,
    },
  });

  const course2Lesson4 = await prisma.lesson.upsert({
    where: { id: 'lesson-react-effects' },
    update: {},
    create: {
      id: 'lesson-react-effects',
      courseId: course2.id,
      title: 'Side Effects and useEffect',
      type: 'VIDEO',
      contentUrl: 'https://videos.learnsphere.com/react-effects.mp4',
      durationSeconds: 1320,
      position: 4,
    },
  });

  const course2Lesson5 = await prisma.lesson.upsert({
    where: { id: 'lesson-react-advanced' },
    update: {},
    create: {
      id: 'lesson-react-advanced',
      courseId: course2.id,
      title: 'Advanced Patterns',
      type: 'IMAGE',
      contentUrl: 'https://images.learnsphere.com/react-patterns.png',
      durationSeconds: null,
      position: 5,
    },
  });

  console.log('Lessons created');

  // QUIZZES
  const quiz1 = await prisma.quiz.upsert({
    where: { id: 'quiz-js-fundamentals' },
    update: {},
    create: {
      id: 'quiz-js-fundamentals',
      courseId: course1.id,
      title: 'JavaScript Fundamentals Assessment',
    },
  });

  const quiz2 = await prisma.quiz.upsert({
    where: { id: 'quiz-react-essentials' },
    update: {},
    create: {
      id: 'quiz-react-essentials',
      courseId: course2.id,
      title: 'React Essentials Assessment',
    },
  });

  // QUIZ 1 QUESTIONS
  const q1q1 = await prisma.quizQuestion.upsert({
    where: { id: 'q1-question-1' },
    update: {},
    create: {
      id: 'q1-question-1',
      quizId: quiz1.id,
      questionText: 'What is the correct way to declare a variable in ES6?',
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q1q1-opt1' },
    update: {},
    create: {
      id: 'q1q1-opt1',
      questionId: q1q1.id,
      optionText: 'var myVariable = 10;',
      isCorrect: false,
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q1q1-opt2' },
    update: {},
    create: {
      id: 'q1q1-opt2',
      questionId: q1q1.id,
      optionText: 'let myVariable = 10;',
      isCorrect: true,
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q1q1-opt3' },
    update: {},
    create: {
      id: 'q1q1-opt3',
      questionId: q1q1.id,
      optionText: 'variable myVariable = 10;',
      isCorrect: false,
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q1q1-opt4' },
    update: {},
    create: {
      id: 'q1q1-opt4',
      questionId: q1q1.id,
      optionText: 'int myVariable = 10;',
      isCorrect: false,
    },
  });

  const q1q2 = await prisma.quizQuestion.upsert({
    where: { id: 'q1-question-2' },
    update: {},
    create: {
      id: 'q1-question-2',
      quizId: quiz1.id,
      questionText: 'Which method is used to add an element to the end of an array?',
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q1q2-opt1' },
    update: {},
    create: {
      id: 'q1q2-opt1',
      questionId: q1q2.id,
      optionText: 'array.add()',
      isCorrect: false,
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q1q2-opt2' },
    update: {},
    create: {
      id: 'q1q2-opt2',
      questionId: q1q2.id,
      optionText: 'array.append()',
      isCorrect: false,
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q1q2-opt3' },
    update: {},
    create: {
      id: 'q1q2-opt3',
      questionId: q1q2.id,
      optionText: 'array.push()',
      isCorrect: true,
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q1q2-opt4' },
    update: {},
    create: {
      id: 'q1q2-opt4',
      questionId: q1q2.id,
      optionText: 'array.insert()',
      isCorrect: false,
    },
  });

  const q1q3 = await prisma.quizQuestion.upsert({
    where: { id: 'q1-question-3' },
    update: {},
    create: {
      id: 'q1-question-3',
      quizId: quiz1.id,
      questionText: 'What does the "this" keyword refer to in JavaScript?',
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q1q3-opt1' },
    update: {},
    create: {
      id: 'q1q3-opt1',
      questionId: q1q3.id,
      optionText: 'The global object',
      isCorrect: false,
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q1q3-opt2' },
    update: {},
    create: {
      id: 'q1q3-opt2',
      questionId: q1q3.id,
      optionText: 'The object that called the function',
      isCorrect: true,
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q1q3-opt3' },
    update: {},
    create: {
      id: 'q1q3-opt3',
      questionId: q1q3.id,
      optionText: 'The parent function',
      isCorrect: false,
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q1q3-opt4' },
    update: {},
    create: {
      id: 'q1q3-opt4',
      questionId: q1q3.id,
      optionText: 'None of the above',
      isCorrect: false,
    },
  });

  // QUIZ 2 QUESTIONS
  const q2q1 = await prisma.quizQuestion.upsert({
    where: { id: 'q2-question-1' },
    update: {},
    create: {
      id: 'q2-question-1',
      quizId: quiz2.id,
      questionText: 'What is a React component?',
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q2q1-opt1' },
    update: {},
    create: {
      id: 'q2q1-opt1',
      questionId: q2q1.id,
      optionText: 'A function that returns HTML',
      isCorrect: false,
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q2q1-opt2' },
    update: {},
    create: {
      id: 'q2q1-opt2',
      questionId: q2q1.id,
      optionText: 'A reusable piece of UI',
      isCorrect: true,
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q2q1-opt3' },
    update: {},
    create: {
      id: 'q2q1-opt3',
      questionId: q2q1.id,
      optionText: 'A database table',
      isCorrect: false,
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q2q1-opt4' },
    update: {},
    create: {
      id: 'q2q1-opt4',
      questionId: q2q1.id,
      optionText: 'A CSS stylesheet',
      isCorrect: false,
    },
  });

  const q2q2 = await prisma.quizQuestion.upsert({
    where: { id: 'q2-question-2' },
    update: {},
    create: {
      id: 'q2-question-2',
      quizId: quiz2.id,
      questionText: 'Which hook is used to manage state in functional components?',
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q2q2-opt1' },
    update: {},
    create: {
      id: 'q2q2-opt1',
      questionId: q2q2.id,
      optionText: 'useEffect',
      isCorrect: false,
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q2q2-opt2' },
    update: {},
    create: {
      id: 'q2q2-opt2',
      questionId: q2q2.id,
      optionText: 'useState',
      isCorrect: true,
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q2q2-opt3' },
    update: {},
    create: {
      id: 'q2q2-opt3',
      questionId: q2q2.id,
      optionText: 'useContext',
      isCorrect: false,
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q2q2-opt4' },
    update: {},
    create: {
      id: 'q2q2-opt4',
      questionId: q2q2.id,
      optionText: 'useReducer',
      isCorrect: false,
    },
  });

  const q2q3 = await prisma.quizQuestion.upsert({
    where: { id: 'q2-question-3' },
    update: {},
    create: {
      id: 'q2-question-3',
      quizId: quiz2.id,
      questionText: 'What is JSX?',
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q2q3-opt1' },
    update: {},
    create: {
      id: 'q2q3-opt1',
      questionId: q2q3.id,
      optionText: 'A JavaScript extension',
      isCorrect: false,
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q2q3-opt2' },
    update: {},
    create: {
      id: 'q2q3-opt2',
      questionId: q2q3.id,
      optionText: 'JavaScript XML syntax',
      isCorrect: true,
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q2q3-opt3' },
    update: {},
    create: {
      id: 'q2q3-opt3',
      questionId: q2q3.id,
      optionText: 'A CSS framework',
      isCorrect: false,
    },
  });

  await prisma.quizOption.upsert({
    where: { id: 'q2q3-opt4' },
    update: {},
    create: {
      id: 'q2q3-opt4',
      questionId: q2q3.id,
      optionText: 'A database query language',
      isCorrect: false,
    },
  });

  console.log('Quizzes created');

  // ENROLLMENTS
  const enrollment1_1 = await prisma.courseEnrollment.upsert({
    where: { 
      userId_courseId: {
        userId: learner1.id,
        courseId: course1.id,
      }
    },
    update: {},
    create: {
      userId: learner1.id,
      courseId: course1.id,
      status: 'COMPLETED',
      startDate: new Date('2026-01-15'),
      completedAt: new Date('2026-02-05'),
    },
  });

  const enrollment1_2 = await prisma.courseEnrollment.upsert({
    where: { 
      userId_courseId: {
        userId: learner1.id,
        courseId: course2.id,
      }
    },
    update: {},
    create: {
      userId: learner1.id,
      courseId: course2.id,
      status: 'IN_PROGRESS',
      startDate: new Date('2026-02-01'),
    },
  });

  const enrollment2_1 = await prisma.courseEnrollment.upsert({
    where: { 
      userId_courseId: {
        userId: learner2.id,
        courseId: course1.id,
      }
    },
    update: {},
    create: {
      userId: learner2.id,
      courseId: course1.id,
      status: 'IN_PROGRESS',
      startDate: new Date('2026-01-20'),
    },
  });

  const enrollment2_2 = await prisma.courseEnrollment.upsert({
    where: { 
      userId_courseId: {
        userId: learner2.id,
        courseId: course2.id,
      }
    },
    update: {},
    create: {
      userId: learner2.id,
      courseId: course2.id,
      status: 'YET_TO_START',
    },
  });

  const enrollment3_1 = await prisma.courseEnrollment.upsert({
    where: { 
      userId_courseId: {
        userId: learner3.id,
        courseId: course1.id,
      }
    },
    update: {},
    create: {
      userId: learner3.id,
      courseId: course1.id,
      status: 'YET_TO_START',
    },
  });

  const enrollment3_2 = await prisma.courseEnrollment.upsert({
    where: { 
      userId_courseId: {
        userId: learner3.id,
        courseId: course2.id,
      }
    },
    update: {},
    create: {
      userId: learner3.id,
      courseId: course2.id,
      status: 'IN_PROGRESS',
      startDate: new Date('2026-01-25'),
    },
  });

  const enrollment4_1 = await prisma.courseEnrollment.upsert({
    where: { 
      userId_courseId: {
        userId: learner4.id,
        courseId: course1.id,
      }
    },
    update: {},
    create: {
      userId: learner4.id,
      courseId: course1.id,
      status: 'IN_PROGRESS',
      startDate: new Date('2026-02-03'),
    },
  });

  const enrollment4_2 = await prisma.courseEnrollment.upsert({
    where: { 
      userId_courseId: {
        userId: learner4.id,
        courseId: course2.id,
      }
    },
    update: {},
    create: {
      userId: learner4.id,
      courseId: course2.id,
      status: 'YET_TO_START',
    },
  });

  console.log('Enrollments created');

  // LESSON PROGRESS - COMPLETED learner (learner1, course1)
  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: learner1.id,
        lessonId: course1Lesson1.id,
      }
    },
    update: {},
    create: {
      userId: learner1.id,
      lessonId: course1Lesson1.id,
      isCompleted: true,
      completedAt: new Date('2026-01-16'),
      timeSpentSeconds: 920,
    },
  });

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: learner1.id,
        lessonId: course1Lesson2.id,
      }
    },
    update: {},
    create: {
      userId: learner1.id,
      lessonId: course1Lesson2.id,
      isCompleted: true,
      completedAt: new Date('2026-01-18'),
      timeSpentSeconds: 1140,
    },
  });

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: learner1.id,
        lessonId: course1Lesson3.id,
      }
    },
    update: {},
    create: {
      userId: learner1.id,
      lessonId: course1Lesson3.id,
      isCompleted: true,
      completedAt: new Date('2026-01-22'),
      timeSpentSeconds: 600,
    },
  });

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: learner1.id,
        lessonId: course1Lesson4.id,
      }
    },
    update: {},
    create: {
      userId: learner1.id,
      lessonId: course1Lesson4.id,
      isCompleted: true,
      completedAt: new Date('2026-01-28'),
      timeSpentSeconds: 1380,
    },
  });

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: learner1.id,
        lessonId: course1Lesson5.id,
      }
    },
    update: {},
    create: {
      userId: learner1.id,
      lessonId: course1Lesson5.id,
      isCompleted: true,
      completedAt: new Date('2026-02-05'),
      timeSpentSeconds: 1560,
    },
  });

  // LESSON PROGRESS - IN_PROGRESS learner (learner2, course1) - half completed
  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: learner2.id,
        lessonId: course1Lesson1.id,
      }
    },
    update: {},
    create: {
      userId: learner2.id,
      lessonId: course1Lesson1.id,
      isCompleted: true,
      completedAt: new Date('2026-01-21'),
      timeSpentSeconds: 880,
    },
  });

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: learner2.id,
        lessonId: course1Lesson2.id,
      }
    },
    update: {},
    create: {
      userId: learner2.id,
      lessonId: course1Lesson2.id,
      isCompleted: true,
      completedAt: new Date('2026-01-25'),
      timeSpentSeconds: 1100,
    },
  });

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: learner2.id,
        lessonId: course1Lesson3.id,
      }
    },
    update: {},
    create: {
      userId: learner2.id,
      lessonId: course1Lesson3.id,
      isCompleted: false,
      timeSpentSeconds: 180,
    },
  });

  // LESSON PROGRESS - learner4 struggling on course1
  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: learner4.id,
        lessonId: course1Lesson1.id,
      }
    },
    update: {},
    create: {
      userId: learner4.id,
      lessonId: course1Lesson1.id,
      isCompleted: true,
      completedAt: new Date('2026-02-04'),
      timeSpentSeconds: 1800,
    },
  });

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: learner4.id,
        lessonId: course1Lesson2.id,
      }
    },
    update: {},
    create: {
      userId: learner4.id,
      lessonId: course1Lesson2.id,
      isCompleted: false,
      timeSpentSeconds: 2400,
    },
  });

  // LESSON PROGRESS - learner1 on course2 (in progress)
  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: learner1.id,
        lessonId: course2Lesson1.id,
      }
    },
    update: {},
    create: {
      userId: learner1.id,
      lessonId: course2Lesson1.id,
      isCompleted: true,
      completedAt: new Date('2026-02-02'),
      timeSpentSeconds: 1020,
    },
  });

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: learner1.id,
        lessonId: course2Lesson2.id,
      }
    },
    update: {},
    create: {
      userId: learner1.id,
      lessonId: course2Lesson2.id,
      isCompleted: true,
      completedAt: new Date('2026-02-04'),
      timeSpentSeconds: 1260,
    },
  });

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: learner1.id,
        lessonId: course2Lesson3.id,
      }
    },
    update: {},
    create: {
      userId: learner1.id,
      lessonId: course2Lesson3.id,
      isCompleted: false,
      timeSpentSeconds: 240,
    },
  });

  console.log('Lesson progress created');

  // QUIZ ATTEMPTS - learner4 struggling (multiple attempts, decreasing scores)
  const attempt1 = await prisma.quizAttempt.upsert({
    where: { id: 'attempt-learner4-quiz1-1' },
    update: {},
    create: {
      id: 'attempt-learner4-quiz1-1',
      userId: learner4.id,
      quizId: quiz1.id,
      attemptNumber: 1,
      score: 66.67,
      pointsAwarded: 20,
      attemptedAt: new Date('2026-02-05T10:30:00Z'),
    },
  });

  const attempt2 = await prisma.quizAttempt.upsert({
    where: { id: 'attempt-learner4-quiz1-2' },
    update: {},
    create: {
      id: 'attempt-learner4-quiz1-2',
      userId: learner4.id,
      quizId: quiz1.id,
      attemptNumber: 2,
      score: 33.33,
      pointsAwarded: 10,
      attemptedAt: new Date('2026-02-06T14:15:00Z'),
    },
  });

  const attempt3 = await prisma.quizAttempt.upsert({
    where: { id: 'attempt-learner4-quiz1-3' },
    update: {},
    create: {
      id: 'attempt-learner4-quiz1-3',
      userId: learner4.id,
      quizId: quiz1.id,
      attemptNumber: 3,
      score: 33.33,
      pointsAwarded: 10,
      attemptedAt: new Date('2026-02-07T09:45:00Z'),
    },
  });

  // QUIZ ATTEMPTS - successful learner
  const attempt4 = await prisma.quizAttempt.upsert({
    where: { id: 'attempt-learner1-quiz1-1' },
    update: {},
    create: {
      id: 'attempt-learner1-quiz1-1',
      userId: learner1.id,
      quizId: quiz1.id,
      attemptNumber: 1,
      score: 100,
      pointsAwarded: 30,
      attemptedAt: new Date('2026-02-05T16:00:00Z'),
    },
  });

  const attempt5 = await prisma.quizAttempt.upsert({
    where: { id: 'attempt-learner2-quiz1-1' },
    update: {},
    create: {
      id: 'attempt-learner2-quiz1-1',
      userId: learner2.id,
      quizId: quiz1.id,
      attemptNumber: 1,
      score: 66.67,
      pointsAwarded: 20,
      attemptedAt: new Date('2026-01-26T11:20:00Z'),
    },
  });

  const attempt6 = await prisma.quizAttempt.upsert({
    where: { id: 'attempt-learner2-quiz1-2' },
    update: {},
    create: {
      id: 'attempt-learner2-quiz1-2',
      userId: learner2.id,
      quizId: quiz1.id,
      attemptNumber: 2,
      score: 100,
      pointsAwarded: 30,
      attemptedAt: new Date('2026-01-27T15:30:00Z'),
    },
  });

  console.log('Quiz attempts created');

  // POINTS LEDGER
  await prisma.pointsLedger.upsert({
    where: { id: 'points-learner4-quiz1-1' },
    update: {},
    create: {
      id: 'points-learner4-quiz1-1',
      userId: learner4.id,
      sourceType: 'QUIZ',
      sourceId: quiz1.id,
      points: 20,
      createdAt: new Date('2026-02-05T10:30:00Z'),
    },
  });

  await prisma.pointsLedger.upsert({
    where: { id: 'points-learner4-quiz1-2' },
    update: {},
    create: {
      id: 'points-learner4-quiz1-2',
      userId: learner4.id,
      sourceType: 'QUIZ',
      sourceId: quiz1.id,
      points: 10,
      createdAt: new Date('2026-02-06T14:15:00Z'),
    },
  });

  await prisma.pointsLedger.upsert({
    where: { id: 'points-learner4-quiz1-3' },
    update: {},
    create: {
      id: 'points-learner4-quiz1-3',
      userId: learner4.id,
      sourceType: 'QUIZ',
      sourceId: quiz1.id,
      points: 10,
      createdAt: new Date('2026-02-07T09:45:00Z'),
    },
  });

  await prisma.pointsLedger.upsert({
    where: { id: 'points-learner1-quiz1-1' },
    update: {},
    create: {
      id: 'points-learner1-quiz1-1',
      userId: learner1.id,
      sourceType: 'QUIZ',
      sourceId: quiz1.id,
      points: 30,
      createdAt: new Date('2026-02-05T16:00:00Z'),
    },
  });

  await prisma.pointsLedger.upsert({
    where: { id: 'points-learner2-quiz1-1' },
    update: {},
    create: {
      id: 'points-learner2-quiz1-1',
      userId: learner2.id,
      sourceType: 'QUIZ',
      sourceId: quiz1.id,
      points: 20,
      createdAt: new Date('2026-01-26T11:20:00Z'),
    },
  });

  await prisma.pointsLedger.upsert({
    where: { id: 'points-learner2-quiz1-2' },
    update: {},
    create: {
      id: 'points-learner2-quiz1-2',
      userId: learner2.id,
      sourceType: 'QUIZ',
      sourceId: quiz1.id,
      points: 30,
      createdAt: new Date('2026-01-27T15:30:00Z'),
    },
  });

  console.log('Points ledger created');

  // BADGES
  await prisma.badge.upsert({
    where: { id: 'badge-bronze' },
    update: {},
    create: {
      id: 'badge-bronze',
      name: 'Bronze Learner',
      minPoints: 10,
    },
  });

  await prisma.badge.upsert({
    where: { id: 'badge-silver' },
    update: {},
    create: {
      id: 'badge-silver',
      name: 'Silver Scholar',
      minPoints: 50,
    },
  });

  await prisma.badge.upsert({
    where: { id: 'badge-gold' },
    update: {},
    create: {
      id: 'badge-gold',
      name: 'Gold Master',
      minPoints: 100,
    },
  });

  await prisma.badge.upsert({
    where: { id: 'badge-platinum' },
    update: {},
    create: {
      id: 'badge-platinum',
      name: 'Platinum Expert',
      minPoints: 250,
    },
  });

  await prisma.badge.upsert({
    where: { id: 'badge-diamond' },
    update: {},
    create: {
      id: 'badge-diamond',
      name: 'Diamond Champion',
      minPoints: 500,
    },
  });

  console.log('Badges created');

  console.log('🌱 Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

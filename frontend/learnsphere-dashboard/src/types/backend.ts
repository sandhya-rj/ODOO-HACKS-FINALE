/**
 * TypeScript interfaces mirroring backend Prisma models
 * 
 * These types ensure type safety across the frontend application
 * and maintain consistency with the backend database schema.
 */

// ============================================
// ENUMS
// ============================================

export enum UserRole {
  ADMIN = 'ADMIN',
  INSTRUCTOR = 'INSTRUCTOR',
  LEARNER = 'LEARNER',
}

export enum LessonType {
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  IMAGE = 'IMAGE',
  QUIZ = 'QUIZ',
}

export enum EnrollmentStatus {
  YET_TO_START = 'YET_TO_START',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum AlertType {
  LEARNER_STRUGGLE = 'LEARNER_STRUGGLE',
  LESSON_PACING_SLOW = 'LESSON_PACING_SLOW',
  LESSON_PACING_FAST = 'LESSON_PACING_FAST',
  COURSE_DROPOFF = 'COURSE_DROPOFF',
  LESSON_DIFFICULT = 'LESSON_DIFFICULT',
}

export enum AlertSeverity {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum AlertSource {
  QUIZ = 'quiz',
  LESSON = 'lesson',
  COURSE = 'course',
  MOCK = 'mock',
}

// ============================================
// CORE MODELS
// ============================================

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  tags: string[];
  totalLessons: number;
  totalDuration: string;
  published: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: number;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  timeSpentSeconds: number;
}

export interface QuizAttempt {
  quizId: string;
  attemptNumber: number;
  score: number;
  pointsAwarded: number;
}

export interface CourseEnrollment {
  courseId: string;
  userId: string;
  status: EnrollmentStatus;
  completionRate: number;
}

export interface Alert {
  alertId: string;
  type: AlertType;
  message: string;
  severity: AlertSeverity;
  source: AlertSource;
  createdAt: string;
}

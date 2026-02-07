/**
 * TypeScript Interfaces for Backend Models
 * 
 * These interfaces mirror the Prisma schema on the backend,
 * ensuring type safety and consistency across the application.
 */

/**
 * User Roles
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  INSTRUCTOR = 'INSTRUCTOR',
  LEARNER = 'LEARNER',
}

/**
 * User Model
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

/**
 * Course Status
 */
export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Course Model
 */
export interface Course {
  id: string;
  title: string;
  description: string;
  status: CourseStatus;
  instructorId: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  instructor?: User;
  lessons?: Lesson[];
  quizzes?: Quiz[];
  enrollments?: CourseEnrollment[];
}

/**
 * Lesson Types
 */
export enum LessonType {
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  IMAGE = 'IMAGE',
  INTERACTIVE = 'INTERACTIVE',
}

/**
 * Lesson Model
 */
export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  contentUrl?: string;
  durationSeconds?: number;
  position: number;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  course?: Course;
  progress?: LessonProgress[];
}

/**
 * Lesson Progress Model
 */
export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  isCompleted: boolean;
  timeSpentSeconds: number;
  lastAccessedAt: string;
  completedAt?: string;
  // Relations
  user?: User;
  lesson?: Lesson;
}

/**
 * Quiz Model
 */
export interface Quiz {
  id: string;
  title: string;
  description?: string;
  passingScore: number;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  course?: Course;
  questions?: QuizQuestion[];
  attempts?: QuizAttempt[];
}

/**
 * Quiz Question Model
 */
export interface QuizQuestion {
  id: string;
  quizId: string;
  questionText: string;
  position: number;
  points: number;
  createdAt: string;
  updatedAt: string;
  // Relations
  quiz?: Quiz;
  options?: QuizOption[];
}

/**
 * Quiz Option Model
 */
export interface QuizOption {
  id: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
  // Relations
  question?: QuizQuestion;
}

/**
 * Quiz Attempt Model
 */
export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  attemptNumber: number;
  startedAt: string;
  completedAt?: string;
  // Relations
  user?: User;
  quiz?: Quiz;
  answers?: QuizAnswer[];
}

/**
 * Quiz Answer Model
 */
export interface QuizAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  createdAt: string;
  // Relations
  attempt?: QuizAttempt;
  question?: QuizQuestion;
  selectedOption?: QuizOption;
}

/**
 * Course Enrollment Model
 */
export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedAt?: string;
  // Relations
  user?: User;
  course?: Course;
}

/**
 * Points Ledger Model
 */
export interface PointsLedger {
  id: string;
  userId: string;
  points: number;
  reason: string;
  courseId?: string;
  lessonId?: string;
  quizId?: string;
  createdAt: string;
  // Relations
  user?: User;
  course?: Course;
  lesson?: Lesson;
  quiz?: Quiz;
}

/**
 * Badge Model
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  earnedBy?: UserBadge[];
}

/**
 * User Badge Model
 */
export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: string;
  // Relations
  user?: User;
  badge?: Badge;
}

/**
 * Insight Types (from backend insight system)
 */
export enum InsightType {
  LEARNER_STRUGGLE = 'LEARNER_STRUGGLE',
  LESSON_PACING_SLOW = 'LESSON_PACING_SLOW',
  LESSON_PACING_FAST = 'LESSON_PACING_FAST',
  COURSE_DROPOFF = 'COURSE_DROPOFF',
  LESSON_DIFFICULT = 'LESSON_DIFFICULT',
}

/**
 * Insight Severity
 */
export enum InsightSeverity {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

/**
 * Insight/Alert Model
 */
export interface Insight {
  alertId: string;
  source: 'quiz' | 'lesson' | 'course' | 'mock';
  type: InsightType;
  message: string;
  severity: InsightSeverity;
  createdAt: string;
  // Additional context
  userId?: string;
  courseId?: string;
  lessonId?: string;
  quizId?: string;
}

/**
 * UI State Types
 */
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

/**
 * Form State Types
 */
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isDirty: boolean;
}

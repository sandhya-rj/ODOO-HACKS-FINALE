/**
 * API Client for LearnSphere Backend
 * 
 * Production-grade REST API client with proper error handling,
 * type safety, and consistent response formatting.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export class APIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body?: unknown
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = 'APIError';
  }
}

/**
 * Base fetch wrapper with error handling and JSON parsing
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new APIError(response.status, response.statusText, body);
  }

  return response.json();
}

/**
 * Health Check
 */
export const healthAPI = {
  check: () => apiFetch<{ ok: boolean }>('/health'),
};

/**
 * Quiz Submission API
 */
export interface QuizSubmitRequest {
  attempts: number;
  timeSpent: number;
  score?: number;
}

export interface QuizSubmitResponse {
  submitted: boolean;
  alert?: Alert;
}

export const quizAPI = {
  submit: (data: QuizSubmitRequest) =>
    apiFetch<QuizSubmitResponse>('/quiz/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

/**
 * Lesson Completion API
 */
export interface LessonCompleteRequest {
  timeSpent: number;
  expectedTime: number;
}

export interface LessonCompleteResponse {
  completed: boolean;
  alert?: Alert;
}

export const lessonAPI = {
  complete: (data: LessonCompleteRequest) =>
    apiFetch<LessonCompleteResponse>('/lesson/complete', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

/**
 * Insights API
 */
export interface Alert {
  alertId: string;
  source: 'quiz' | 'lesson' | 'mock' | 'performance_tracker' | 'progress_tracker';
  type: 'LEARNER_STRUGGLE' | 'LESSON_PACING_SLOW' | 'LESSON_PACING_FAST' | 'COURSE_DROPOFF' | 'quiz_performance' | 'progress_milestone' | 'engagement_drop';
  message: string;
  severity: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface MockBatchResponse {
  alerts: Alert[];
}

export const insightsAPI = {
  mockBatch: () => apiFetch<MockBatchResponse>('/insights/mock-batch'),
};

/**
 * Progress API
 */
export interface ProgressLessonCompleteRequest {
  userId: number | string;
  lessonId: number;
  courseId: number;
}

export interface ProgressLessonCompleteResponse {
  success: boolean;
  data: {
    lessonProgress: {
      id: number;
      userId: number;
      lessonId: number;
      completed: boolean;
      completedAt: string | null;
    };
    courseProgress: {
      id: number;
      userId: number;
      courseId: number;
      completedLessons: number;
      totalLessons: number;
      progressPercentage: number;
    };
    pointsEarned: number;
  };
}

export interface CourseProgressResponse {
  success: boolean;
  data: {
    courseId: number;
    completedLessons: number;
    totalLessons: number;
    progressPercentage: number;
    lessons: Array<{
      lessonId: number;
      completed: boolean;
      completedAt: string | null;
    }>;
  };
}

export interface UserProgressResponse {
  success: boolean;
  data: Array<{
    courseId: number;
    completedLessons: number;
    totalLessons: number;
    progressPercentage: number;
  }>;
}

export const progressAPI = {
  completeLesson: (data: ProgressLessonCompleteRequest) =>
    apiFetch<ProgressLessonCompleteResponse>('/api/progress/lesson/complete', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getCourseProgress: (courseId: number, userId: number | string) =>
    apiFetch<CourseProgressResponse>(`/api/progress/course/${courseId}?userId=${userId}`),
  getUserProgress: (userId: number | string) =>
    apiFetch<UserProgressResponse>(`/api/progress/user/${userId}`),
};

/**
 * Events API
 */
export type EventType = 
  | 'LESSON_COMPLETED' 
  | 'QUIZ_SUBMITTED' 
  | 'COURSE_ENROLLED' 
  | 'ACHIEVEMENT_EARNED' 
  | 'PROGRESS_MILESTONE'
  | 'COURSE_COMPLETED';

export interface Event {
  id: string;
  userId: string;
  courseId?: string;
  lessonId?: string;
  type: EventType; // Backend uses 'type', not 'eventType'
  metadata: string | Record<string, unknown>; // Backend sends as JSON string
  createdAt: string;
  course?: {
    id: string;
    title: string;
  };
  lesson?: {
    id: string;
    title: string;
  };
}

export interface EventsResponse {
  success: boolean;
  data: Event[];
  count: number;
}

export const eventsAPI = {
  getEvents: (userId: number, limit?: number) =>
    apiFetch<EventsResponse>(
      `/api/events?userId=${userId}${limit ? `&limit=${limit}` : ''}`
    ),
  
  getInstructorEvents: (instructorId: string, limit?: number) =>
    apiFetch<EventsResponse>(
      `/api/events/instructor?instructorId=${instructorId}${limit ? `&limit=${limit}` : ''}`
    ),
};

/**
 * Notifications API
 */
export type NotificationStatus = 'UNREAD' | 'READ';

export interface Notification {
  id: number;
  userId: number;
  message: string;
  status: NotificationStatus;
  relatedEventId: number | null;
  createdAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  count: number;
}

export interface MarkNotificationReadResponse {
  success: boolean;
  data: Notification;
}

export const notificationsAPI = {
  getNotifications: (userId: number, limit?: number) =>
    apiFetch<NotificationsResponse>(
      `/api/notifications?userId=${userId}${limit ? `&limit=${limit}` : ''}`
    ),
  markAsRead: (notificationId: number) =>
    apiFetch<MarkNotificationReadResponse>(`/api/notifications/${notificationId}/read`, {
      method: 'PATCH',
    }),
};

/**
 * Leaderboard API Types
 */
export interface LeaderboardEntry {
  userId: string;
  name: string;
  email: string;
  totalPoints: number;
  completedCourses: number;
  rank: number;
}

export interface LeaderboardResponse {
  success: boolean;
  data: LeaderboardEntry[];
  count: number;
}

/**
 * Leaderboard API
 */
export const leaderboardAPI = {
  getTopLearners: () => apiFetch<LeaderboardResponse>('/api/leaderboard/top-learners'),
};

/**
 * Course API Types
 */
export interface Course {
  id: string;
  title: string;
  description?: string;
  published: boolean;
  imageUrl?: string;
  tags?: string[];
  lessonsCount?: number;
  totalDuration?: string;
  progress?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CoursesResponse {
  success: boolean;
  data: Course[];
  count?: number;
}

export interface CourseResponse {
  success: boolean;
  data: Course;
}

/**
 * Course API
 */
export const coursesAPI = {
  getAll: async () => {
    const response = await apiFetch<CoursesResponse>('/courses');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiFetch<CourseResponse>(`/courses/${id}`);
    return response.data;
  },
  create: (course: Partial<Course>) => 
    apiFetch<Course>('/courses', {
      method: 'POST',
      body: JSON.stringify(course),
    }),
};

/**
 * Unified API Client
 */
export const api = {
  health: healthAPI,
  quiz: quizAPI,
  lesson: lessonAPI,
  insights: insightsAPI,
  progress: progressAPI,
  events: eventsAPI,
  notifications: notificationsAPI,
  leaderboard: leaderboardAPI,
  courses: coursesAPI,
};

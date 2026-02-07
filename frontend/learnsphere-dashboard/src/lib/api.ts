/**
 * API Client for LearnSphere Backend
 * 
 * Production-grade REST API client with proper error handling,
 * type safety, and consistent response formatting.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
  source: 'quiz' | 'lesson' | 'mock';
  type: 'LEARNER_STRUGGLE' | 'LESSON_PACING_SLOW' | 'LESSON_PACING_FAST' | 'COURSE_DROPOFF';
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
 * Unified API Client
 */
export const api = {
  health: healthAPI,
  quiz: quizAPI,
  lesson: lessonAPI,
  insights: insightsAPI,
};

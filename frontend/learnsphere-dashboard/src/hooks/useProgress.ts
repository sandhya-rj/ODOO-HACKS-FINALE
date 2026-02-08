import { useState, useCallback } from 'react';
import { api, type ProgressLessonCompleteResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export interface LessonProgressState {
  lessonId: number;
  completed: boolean;
  completedAt: string | null;
}

export interface CourseProgressState {
  courseId: number;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  lessons: LessonProgressState[];
}

export function useProgress(userId: number | string) {
  const [isLoading, setIsLoading] = useState(false);
  const [courseProgress, setCourseProgress] = useState<Map<number, CourseProgressState>>(new Map());
  const { toast } = useToast();

  /**
   * Complete a lesson and update progress
   */
  const completeLesson = useCallback(
    async (lessonId: number, courseId: number): Promise<ProgressLessonCompleteResponse | null> => {
      setIsLoading(true);
      try {
        const result = await api.progress.completeLesson({
          userId,
          lessonId,
          courseId,
        });

        if (result.success) {
          // Update local course progress state
          const currentProgress = courseProgress.get(courseId);
          if (currentProgress && Array.isArray(currentProgress.lessons)) {
            const updatedLessons = currentProgress.lessons.map((l) =>
              l.lessonId === lessonId
                ? { ...l, completed: true, completedAt: new Date().toISOString() }
                : l
            );
            setCourseProgress(prev => new Map(prev).set(courseId, {
              ...currentProgress,
              completedLessons: result.data.courseProgress.completedLessons,
              progressPercentage: result.data.courseProgress.progressPercentage,
              lessons: updatedLessons,
            }));
          }

          // Show success toast with points earned
          toast({
            title: "Lesson Complete!",
            description: `You earned ${result.data.pointsEarned} points. Course progress: ${Math.round(result.data.courseProgress.progressPercentage)}%`,
            variant: "default",
          });

          return result;
        }

        return null;
      } catch (error) {
        console.error('Failed to complete lesson:', error);
        toast({
          title: "Error",
          description: "Failed to save lesson progress. Please try again.",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [userId, courseProgress, toast]
  );

  /**
   * Fetch course progress from backend
   */
  const fetchCourseProgress = useCallback(
    async (courseId: number): Promise<void> => {
      setIsLoading(true);
      try {
        const result = await api.progress.getCourseProgress(courseId, userId);
        
        if (result.success && result.data) {
          setCourseProgress(prev => new Map(prev).set(courseId, {
            courseId: result.data.courseId || courseId,
            completedLessons: result.data.completedLessons || 0,
            totalLessons: result.data.totalLessons || 0,
            progressPercentage: result.data.progressPercentage || 0,
            lessons: (result.data.lessons && Array.isArray(result.data.lessons)) ? result.data.lessons.map(l => ({
              lessonId: l?.lessonId || 0,
              completed: l?.completed || false,
              completedAt: l?.completedAt || null,
            })) : [],
          }));
        }
      } catch (error) {
        console.error('Failed to fetch course progress:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  /**
   * Get progress for a specific course
   */
  const getProgress = useCallback(
    (courseId: number): CourseProgressState | undefined => {
      return courseProgress.get(courseId);
    },
    [courseProgress]
  );

  /**
   * Check if a specific lesson is completed
   */
  const isLessonCompleted = useCallback(
    (courseId: number, lessonId: number): boolean => {
      const progress = courseProgress.get(courseId);
      if (!progress) return false;
      const lesson = progress.lessons.find(l => l.lessonId === lessonId);
      return lesson?.completed ?? false;
    },
    [courseProgress]
  );

  return {
    isLoading,
    completeLesson,
    fetchCourseProgress,
    getProgress,
    isLessonCompleted,
    courseProgress: courseProgress,
  };
}

// Local image imports — NO external URLs
import courseMl from "@/assets/course-ml.png";
import courseReact from "@/assets/course-react.png";
import courseBusiness from "@/assets/course-business.png";
import courseUx from "@/assets/course-ux.png";
import courseAws from "@/assets/course-aws.png";
import courseData from "@/assets/course-data.png";
import fallbackCourse from "@/assets/fallback-course.png";
import heroBanner from "@/assets/hero-banner.png";
import heroSecondary from "@/assets/hero-secondary.png";
import insightsBanner from "@/assets/insights-banner.png";
import profileBanner from "@/assets/profile-banner.png";
import quizBanner from "@/assets/quiz-banner.png";
import instructorBanner from "@/assets/instructor-banner.png";
import leaderboardBanner from "@/assets/leaderboard-banner.png";
import lessonPlaceholder1 from "@/assets/lesson-placeholder-1.png";
import lessonPlaceholder2 from "@/assets/lesson-placeholder-2.png";
import lessonPlaceholder3 from "@/assets/lesson-placeholder-3.png";
import lessonVideo1 from "@/assets/lesson-video-1.png";
import lessonVideo2 from "@/assets/lesson-video-2.png";
import lessonVideo3 from "@/assets/lesson-video-3.png";
import featureInsights from "@/assets/feature-insights.png";
import featureLeaderboard from "@/assets/feature-leaderboard.png";
import featureQuiz from "@/assets/feature-quiz.png";
import featureAnalytics from "@/assets/feature-analytics.png";
import featureNotifications from "@/assets/feature-notifications.png";
import featureProgress from "@/assets/feature-progress.png";
import featureCourses from "@/assets/feature-courses.png";

/**
 * Map course IDs to local images.
 */
export const courseImageMap: Record<string, string> = {
  "1": courseMl,
  "2": courseReact,
  "3": courseBusiness,
  "4": courseUx,
  "5": courseAws,
  "6": courseData,
};

/**
 * Get local image for a course, with fallback.
 */
export function getCourseImage(courseId: string): string {
  return courseImageMap[courseId] || fallbackCourse;
}

/**
 * Lesson placeholder images — cycle through them.
 */
export const lessonImages = [lessonPlaceholder1, lessonPlaceholder2, lessonPlaceholder3];
export const lessonVideoImages = [lessonVideo1, lessonVideo2, lessonVideo3];

export function getLessonImage(lessonId: string, type: string = "document"): string {
  const num = parseInt(lessonId.replace(/\D/g, ""), 10) || 0;
  if (type === "video") {
    return lessonVideoImages[num % lessonVideoImages.length];
  }
  return lessonImages[num % lessonImages.length];
}

/**
 * Feature images for hero / landing sections.
 */
export const featureImages = {
  insights: featureInsights,
  leaderboard: featureLeaderboard,
  quiz: featureQuiz,
  analytics: featureAnalytics,
  notifications: featureNotifications,
  progress: featureProgress,
  courses: featureCourses,
};

export const bannerImages = {
  hero: heroBanner,
  heroSecondary: heroSecondary,
  insights: insightsBanner,
  profile: profileBanner,
  quiz: quizBanner,
  instructor: instructorBanner,
  leaderboard: leaderboardBanner,
};

export { fallbackCourse };

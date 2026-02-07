import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleProvider } from "@/contexts/RoleContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CoursesPage from "./pages/courses/CoursesPage";
import CourseDetailPage from "./pages/courses/CourseDetailPage";
import LessonPlayer from "./pages/courses/LessonPlayer";
import MyLearningPage from "./pages/my-learning/MyLearningPage";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import CourseEditor from "./pages/instructor/CourseEditor";
import QuizBuilder from "./pages/instructor/QuizBuilder";
import ReportsDashboard from "./pages/instructor/ReportsDashboard";
import QuizPage from "./pages/quiz/QuizPage";
import DemoDashboard from "./pages/demo/DemoDashboard";
import LearnerDemo from "./pages/demo/LearnerDemo";
import InstructorDemoPage from "./pages/demo/InstructorDemoPage";
import SystemStatusPage from "./pages/demo/SystemStatusPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RoleProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DemoDashboard />} />
            <Route path="/home" element={<Index />} />

            {/* Demo Routes - Full screen, no layout */}
            <Route path="/demo/learner" element={<LearnerDemo />} />
            <Route path="/demo/instructor" element={<InstructorDemoPage />} />
            <Route path="/demo/system" element={<SystemStatusPage />} />

            {/* Lesson Player - Full screen, no layout */}
            <Route path="/lesson/:courseId/:lessonId" element={<LessonPlayer />} />

            {/* Pages with AppLayout */}
            <Route path="/courses" element={<AppLayout><CoursesPage /></AppLayout>} />
            <Route path="/course/:id" element={<AppLayout><CourseDetailPage /></AppLayout>} />
            <Route path="/my-learning" element={<AppLayout><MyLearningPage /></AppLayout>} />
            <Route path="/quiz/:courseId" element={<AppLayout><QuizPage /></AppLayout>} />
            <Route path="/instructor/courses" element={<AppLayout><InstructorDashboard /></AppLayout>} />
            <Route path="/instructor/course/:id" element={<AppLayout><CourseEditor /></AppLayout>} />
            <Route path="/instructor/quiz-builder" element={<AppLayout><QuizBuilder /></AppLayout>} />
            <Route path="/instructor/reports" element={<AppLayout><ReportsDashboard /></AppLayout>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RoleProvider, useRole } from "@/contexts/RoleContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { WebsiteLayout } from "@/components/layout/WebsiteLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
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
import { NotificationPopup } from "@/components/notifications/NotificationPopup";
import LearnerDemo from "./pages/demo/LearnerDemo";
import InstructorDemoPage from "./pages/demo/InstructorDemoPage";
import SystemStatusPage from "./pages/demo/SystemStatusPage";
import HomePage from "./pages/home/HomePage";
import AboutPage from "./pages/about/AboutPage";
import PricingPage from "./pages/pricing/PricingPage";
import ContactPage from "./pages/contact/ContactPage";

const queryClient = new QueryClient();

// Reset all demo data on every app load so the demo always starts fresh
const DEMO_USER_ID = "cac7caff-6f69-483f-a39d-50abbf8f54ac";

function DemoResetProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only reset once per browser session (not on every F5 during demo)
    const alreadyReset = sessionStorage.getItem("demo-reset-done");
    if (alreadyReset) {
      console.log("Demo already reset this session — skipping");
      return;
    }

    fetch("http://localhost:5000/courses/reset-demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: DEMO_USER_ID }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          console.log("Demo reset on session start:", data.deleted);
          sessionStorage.setItem("demo-reset-done", "true");
          // Clear per-course completion tracking
          sessionStorage.removeItem("completedCourses");
        }
      })
      .catch(() => {
        // Silently fail if backend is not running
      });
  }, []);

  return <>{children}</>;
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useRole();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useRole();

  return (
    <Routes>
      {/* Login */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />} />

      {/* Demo Routes - Full screen, no layout, no auth */}
      <Route path="/demo" element={<DemoDashboard />} />
      <Route path="/demo/learner" element={<LearnerDemo />} />
      <Route path="/demo/instructor" element={<InstructorDemoPage />} />
      <Route path="/demo/system" element={<SystemStatusPage />} />

      {/* Lesson Player - Full screen, no layout */}
      <Route path="/lesson/:courseId/:lessonId" element={<AuthGate><LessonPlayer /></AuthGate>} />

      {/* Pages with AppLayout */}
      <Route path="/" element={<AuthGate><WebsiteLayout><HomePage /></WebsiteLayout></AuthGate>} />
      <Route path="/home" element={<AuthGate><WebsiteLayout><HomePage /></WebsiteLayout></AuthGate>} />
      <Route path="/courses" element={<AuthGate><WebsiteLayout><CoursesPage /></WebsiteLayout></AuthGate>} />
      <Route path="/course/:id" element={<AuthGate><AppLayout><CourseDetailPage /></AppLayout></AuthGate>} />
      <Route path="/my-learning" element={<AuthGate><WebsiteLayout><MyLearningPage /></WebsiteLayout></AuthGate>} />
      <Route path="/about" element={<AuthGate><WebsiteLayout><AboutPage /></WebsiteLayout></AuthGate>} />
      <Route path="/pricing" element={<AuthGate><WebsiteLayout><PricingPage /></WebsiteLayout></AuthGate>} />
      <Route path="/contact" element={<AuthGate><WebsiteLayout><ContactPage /></WebsiteLayout></AuthGate>} />
      <Route path="/quiz/:courseId" element={<AuthGate><AppLayout><QuizPage /></AppLayout></AuthGate>} />
      <Route path="/instructor/courses" element={<AuthGate><AppLayout><InstructorDashboard /></AppLayout></AuthGate>} />
      <Route path="/instructor/course/:id" element={<AuthGate><AppLayout><CourseEditor /></AppLayout></AuthGate>} />
      <Route path="/instructor/quiz-builder" element={<AuthGate><AppLayout><QuizBuilder /></AppLayout></AuthGate>} />
      <Route path="/instructor/reports" element={<AuthGate><AppLayout><ReportsDashboard /></AppLayout></AuthGate>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RoleProvider>
        <DemoResetProvider>
        <Toaster />
        <Sonner />
        <NotificationPopup />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AppRoutes />
        </BrowserRouter>
        </DemoResetProvider>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

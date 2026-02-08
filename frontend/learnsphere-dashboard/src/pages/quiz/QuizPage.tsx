import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Award, Trophy, AlertCircle, AlertTriangle, TrendingUp, Sparkles, Lightbulb, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockQuizQuestions, mockCourses, quizQuestionsByCourseName } from "@/data/mockData";
import { bannerImages } from "@/data/courseImages";
import { useToast } from "@/hooks/use-toast";
import { LearnerInsightsPanel } from "@/components/insights/LearnerInsightsPanel";

type QuizState = "intro" | "question" | "complete";

// Performance insight shape from backend
interface PerformanceInsight {
  severity: 'critical' | 'warning' | 'info' | 'success' | 'excellent';
  emoji: string;
  title: string;
  message: string;
  recommendation: string;
  percentage: number;
  attemptNumber: number;
}

// Demo: hard-coded userId (in production, get from auth context)
const DEMO_USER_ID = "cac7caff-6f69-483f-a39d-50abbf8f54ac"; // Emma Wilson

// Map frontend course IDs to backend quiz IDs
function getQuizIdFromCourseId(courseId: string | undefined): string {
  const courseToQuizMap: Record<string, string> = {
    '1': 'quiz-js-fundamentals',      // Machine Learning → JS quiz for demo
    '2': 'quiz-react-essentials',     // React course
    '3': 'quiz-js-fundamentals',      // Business → JS quiz for demo
    '4': 'quiz-react-essentials',     // UX Design → React quiz for demo
    // Backend course IDs (if accessed directly)
    'course-javascript-fundamentals': 'quiz-js-fundamentals',
    'course-react-essentials': 'quiz-react-essentials',
  };
  
  return courseToQuizMap[courseId || '1'] || 'quiz-js-fundamentals';
}

export default function QuizPage() {
  const { courseId } = useParams();
  const course = mockCourses.find((c) => c.id === courseId);
  const [state, setState] = useState<QuizState>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const { toast } = useToast();
  const [pointsEarned, setPointsEarned] = useState(0);
  const [performanceInsight, setPerformanceInsight] = useState<PerformanceInsight | null>(null);

  const questions = quizQuestionsByCourseName[courseId || '5'] || mockQuizQuestions;
  const question = questions[currentQ];

  const handleProceed = async () => {
    if (selectedOption === null) return;

    if (selectedOption === question.correctAnswer) {
      setScore((s) => s + 1);
    }

    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelectedOption(null);
    } else {
      setState("complete");
      
      // Submit quiz to backend
      try {
        const finalScore = selectedOption === question.correctAnswer ? score + 1 : score;
        
        const response = await fetch("http://localhost:5000/quiz/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: DEMO_USER_ID,
            quizId: getQuizIdFromCourseId(courseId), // DYNAMIC: use the actual course's quiz
            score: finalScore,
            totalQuestions: questions.length,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Quiz submitted successfully:", data);
        
        // Update points earned with actual backend value
        if (data.pointsAwarded !== undefined) {
          setPointsEarned(data.pointsAwarded);
        }
        
        if (data.attemptNumber !== undefined) {
          setAttemptNumber(data.attemptNumber);
        }
        
        // Extract smart performance insight from backend
        const insight = data.performanceInsight;
        const percentage = data.percentage || Math.round((finalScore / questions.length) * 100);

        // Store performance insight for completion screen
        if (insight) {
          setPerformanceInsight(insight);
        }

        if (data.alert) {
          console.warn("Alert from backend:", data.alert);
        }

        // Trigger leaderboard refresh for instant real-time update
        window.dispatchEvent(new CustomEvent('leaderboard-refresh'));

        // Determine severity-based toast style
        const toastTitle = insight
          ? insight.title
          : `Quiz Submitted!`;
        const toastDesc = insight
          ? `${insight.message}`
          : `You scored ${finalScore}/${questions.length}! +${data.pointsAwarded || finalScore * 10} points awarded.`;

        // Show in-app toast notification
        toast({
          title: toastTitle,
          description: toastDesc,
          variant: insight?.severity === 'critical' || insight?.severity === 'warning' ? 'destructive' : 'default',
        });

        // Dispatch rich performance-aware notification event
        window.dispatchEvent(new CustomEvent('learnsphere-notification', {
          detail: {
            type: 'QUIZ_SUBMITTED',
            title: insight ? insight.title : 'Quiz Results',
            message: insight ? insight.message : `You scored ${finalScore}/${questions.length} on the quiz`,
            points: data.pointsAwarded || finalScore * 10,
            severity: insight?.severity,
            percentage: percentage,
            recommendation: insight?.recommendation,
            instructorNotified: insight?.severity === 'critical' || insight?.severity === 'warning',
            instructorName: 'Michael Chen',
          }
        }));
      } catch (error) {
        console.error("Failed to submit quiz:", error);
        // Continue with local state - don't block UI
      }
    }
  };

  // Mock points calculation fol10
  const mockPointsEarned = Math.floor(score * 10);
  
  // Use backend-provided points if available, otherwise use mock calculation
  const displayPoints = pointsEarned > 0 ? pointsEarned : mockPointsEarned;
  
  // Mock badge progress (would come from backend)
  const badgeProgress = Math.min(65 + (displayPoints / 10), 100);

  const resetQuiz = () => {
    setState("intro");
    setCurrentQ(0);
    setSelectedOption(null);
    setScore(0);
    setPointsEarned(0);
    setAttemptNumber((n) => n + 1);
  };

  if (state === "intro") {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <Card className="border-border/40 rounded-2xl overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/15 to-blue-500/10 flex items-center justify-center mx-auto">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground mb-2">
                {course?.title ?? "Course"} Quiz
              </h1>
              <p className="text-muted-foreground text-sm">
                Test your knowledge and earn points
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-3 bg-accent/50 rounded-xl">
                <span className="text-muted-foreground">Total Questions</span>
                <span className="font-medium text-foreground">
                  {questions.length}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-accent/50 rounded-xl">
                <span className="text-muted-foreground">
                  Attempts Allowed
                </span>
                <span className="font-medium text-foreground">3</span>
              </div>
            </div>
            <Button
              onClick={() => setState("question")}
              className="w-full rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:opacity-90"
            >
              Start Quiz
            </Button>
            <Link
              to={course ? `/course/${course.id}` : "/courses"}
              className="text-sm text-muted-foreground hover:text-foreground block transition-colors"
            >
              ← Back to course
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === "complete") {
    // Performance-based styling
    const severity = performanceInsight?.severity || 'info';
    const percentage = performanceInsight?.percentage || Math.round((score / questions.length) * 100);
    
    const severityConfig: Record<string, { bg: string, border: string, icon: React.ReactNode, iconBg: string, textColor: string, barColor: string }> = {
      critical: {
        bg: 'bg-red-50 dark:bg-red-950/20',
        border: 'border-red-200 dark:border-red-800',
        icon: <AlertCircle className="h-8 w-8 text-red-500" />,
        iconBg: 'bg-red-100 dark:bg-red-900/30',
        textColor: 'text-red-600 dark:text-red-400',
        barColor: '[&>div]:bg-red-500',
      },
      warning: {
        bg: 'bg-orange-50 dark:bg-orange-950/20',
        border: 'border-orange-200 dark:border-orange-800',
        icon: <AlertTriangle className="h-8 w-8 text-orange-500" />,
        iconBg: 'bg-orange-100 dark:bg-orange-900/30',
        textColor: 'text-orange-600 dark:text-orange-400',
        barColor: '[&>div]:bg-orange-500',
      },
      info: {
        bg: 'bg-blue-50 dark:bg-blue-950/20',
        border: 'border-blue-200 dark:border-blue-800',
        icon: <TrendingUp className="h-8 w-8 text-blue-500" />,
        iconBg: 'bg-blue-100 dark:bg-blue-900/30',
        textColor: 'text-blue-600 dark:text-blue-400',
        barColor: '[&>div]:bg-blue-500',
      },
      success: {
        bg: 'bg-green-50 dark:bg-green-950/20',
        border: 'border-green-200 dark:border-green-800',
        icon: <CheckCircle2 className="h-8 w-8 text-green-500" />,
        iconBg: 'bg-green-100 dark:bg-green-900/30',
        textColor: 'text-green-600 dark:text-green-400',
        barColor: '[&>div]:bg-green-500',
      },
      excellent: {
        bg: 'bg-emerald-50 dark:bg-emerald-950/20',
        border: 'border-emerald-200 dark:border-emerald-800',
        icon: <Sparkles className="h-8 w-8 text-emerald-500" />,
        iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
        textColor: 'text-emerald-600 dark:text-emerald-400',
        barColor: '[&>div]:bg-emerald-500',
      },
    };
    
    const config = severityConfig[severity] || severityConfig.info;

    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <Card className={`border-2 rounded-2xl overflow-hidden ${config.border}`}>
          <CardContent className={`p-8 space-y-6 ${config.bg}`}>
            {/* Dynamic icon based on performance */}
            <div className={`h-16 w-16 rounded-2xl ${config.iconBg} flex items-center justify-center mx-auto`}>
              {config.icon}
            </div>
            
            {/* Title & Score */}
            <div>
              <h1 className={`text-xl font-bold mb-2 ${config.textColor}`}>
                {performanceInsight ? performanceInsight.title : 'Quiz Complete!'}
              </h1>
              <p className="text-muted-foreground text-sm">
                You scored {score} out of {questions.length} ({percentage}%)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Attempt #{attemptNumber}
              </p>
            </div>

            {/* Performance Score Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Score</span>
                <span className={`font-bold ${config.textColor}`}>{percentage}%</span>
              </div>
              <Progress value={percentage} className={`h-3 ${config.barColor}`} />
            </div>

            {/* Smart Recommendation Box */}
            {performanceInsight?.recommendation && (
              <div className={`p-4 rounded-xl border-2 text-left ${
                severity === 'critical' ? 'bg-red-100/80 border-red-300 dark:bg-red-900/30 dark:border-red-700' :
                severity === 'warning' ? 'bg-orange-100/80 border-orange-300 dark:bg-orange-900/30 dark:border-orange-700' :
                severity === 'success' || severity === 'excellent' ? 'bg-green-100/80 border-green-300 dark:bg-green-900/30 dark:border-green-700' :
                'bg-blue-100/80 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700'
              }`}>
                <p className={`text-sm font-medium mb-1 ${config.textColor}`}>
                  <Lightbulb className="h-4 w-4 inline mr-1" />Recommendation
                </p>
                <p className="text-sm text-foreground/80">
                  {performanceInsight.recommendation}
                </p>
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-3 bg-accent/50 rounded-xl">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-warning" />
                  Points Earned
                </span>
                <span className="font-bold text-foreground">
                  {displayPoints}
                </span>
              </div>
              <div className={`p-3 border-2 rounded-xl text-center ${config.border} ${config.bg}`}>
                <p className={`font-semibold text-base mb-1 ${config.textColor}`}>
                  {performanceInsight?.emoji || ''} You earned {displayPoints} points!
                </p>
                <p className="text-xs text-muted-foreground">
                  {attemptNumber === 1 ? "First attempt" : 
                   attemptNumber === 2 ? "Second attempt" : 
                   `Attempt #${attemptNumber}`}
                </p>
              </div>
              <div className="p-3 bg-accent/50 rounded-xl text-left">
                <p className="text-muted-foreground mb-2">
                  Progress to next badge
                </p>
                <Progress value={badgeProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Intermediate → Advanced ({Math.round(badgeProgress)}%)
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link to={course ? `/course/${course.id}` : "/courses"}>
                <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:opacity-90">Back to Course</Button>
              </Link>
              <Button variant="outline" onClick={resetQuiz} className="w-full rounded-xl">
                {severity === 'critical' || severity === 'warning' ? 'Review & Retry Quiz' : 'Retry Quiz'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Learning Pace & Insights Panel */}
        <div className="mt-6">
          <LearnerInsightsPanel
            courseId={courseId || '1'}
            courseName={course?.title || 'Course'}
            refreshKey={attemptNumber}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Question {currentQ + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-foreground">
            {Math.round((currentQ / questions.length) * 100)}%
          </span>
        </div>
        <Progress value={(currentQ / questions.length) * 100} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-blue-500" />
      </div>

      <Card className="border-border/40 rounded-2xl overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground">
            {question.question}
          </h2>

          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <button
                key={`${question.id || currentQ}-option-${idx}`}
                onClick={() => setSelectedOption(idx)}
                className={`w-full text-left p-4 rounded-xl border-2 text-sm transition-all duration-200 ${
                  selectedOption === idx
                    ? "border-primary bg-primary/5 text-foreground shadow-sm"
                    : "border-border/40 hover:border-primary/30 hover:bg-accent/30 text-foreground"
                }`}
              >
                <span className="font-medium text-muted-foreground mr-3">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {option}
              </button>
            ))}
          </div>

          <Button
            onClick={handleProceed}
            disabled={selectedOption === null}
            className="w-full rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:opacity-90"
          >
            {currentQ < questions.length - 1 ? "Proceed" : "Finish Quiz"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Award, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockQuizQuestions, mockCourses } from "@/data/mockData";

type QuizState = "intro" | "question" | "complete";

export default function QuizPage() {
  const { courseId } = useParams();
  const course = mockCourses.find((c) => c.id === courseId);
  const [state, setState] = useState<QuizState>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [attemptNumber, setAttemptNumber] = useState(1);

  const questions = mockQuizQuestions;
  const question = questions[currentQ];

  const handleProceed = () => {
    if (selectedOption === null) return;

    if (selectedOption === question.correctAnswer) {
      setScore((s) => s + 1);
    }

    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelectedOption(null);
    } else {
      setState("complete");
      
      // TODO: POST /quiz/submit
      // Send quiz attempt data to backend:
      // {
      //   courseId: courseId,
      //   quizId: "quiz_id_here",
      //   attemptNumber: attemptNumber,
      //   score: score,
      //   totalQuestions: questions.length,
      //   answers: [...selectedAnswers],
      //   timeSpentSeconds: calculatedTime
      // }
      // Backend will calculate and return:
      // - pointsEarned (based on score and attempt multiplier)
      // - badgeProgress (progress toward next badge)
      // - insights (any generated alerts)
    }
  };

  // Mock points calculation following backend rules:
  // Base points per question = 25
  // Attempt multiplier: 1st=100%, 2nd=75%, 3rd+=50%
  const attemptMultiplier = attemptNumber === 1 ? 1.0 : attemptNumber === 2 ? 0.75 : 0.5;
  const pointsEarned = Math.floor(score * 25 * attemptMultiplier);
  
  // Mock badge progress (would come from backend)
  const badgeProgress = Math.min(65 + (pointsEarned / 10), 100);

  const resetQuiz = () => {
    setState("intro");
    setCurrentQ(0);
    setSelectedOption(null);
    setScore(0);
    setAttemptNumber((n) => n + 1);
  };

  if (state === "intro") {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
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
              <div className="flex justify-between p-3 bg-accent rounded-lg">
                <span className="text-muted-foreground">Total Questions</span>
                <span className="font-medium text-foreground">
                  {questions.length}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-accent rounded-lg">
                <span className="text-muted-foreground">
                  Attempts Allowed
                </span>
                <span className="font-medium text-foreground">3</span>
              </div>
            </div>
            <Button
              onClick={() => setState("question")}
              className="w-full"
            >
              Start Quiz
            </Button>
            <Link
              to={course ? `/course/${course.id}` : "/courses"}
              className="text-sm text-muted-foreground hover:text-foreground block"
            >
              ← Back to course
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === "complete") {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground mb-2">
                Quiz Complete!
              </h1>
              <p className="text-muted-foreground text-sm">
                You scored {score} out of {questions.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Attempt #{attemptNumber}
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-3 bg-accent rounded-lg">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-warning" />
                  Points Earned
                </span>
                <span className="font-bold text-foreground">
                  {pointsEarned}
                </span>
              </div>
              <div className="p-3 bg-primary/5 border-2 border-primary/20 rounded-lg text-center">
                <p className="text-primary font-semibold text-base mb-1">
                  You earned {pointsEarned} points!
                </p>
                <p className="text-xs text-muted-foreground">
                  {attemptNumber === 1 ? "100% points (first attempt)" : 
                   attemptNumber === 2 ? "75% points (second attempt)" : 
                   "50% points (third+ attempt)"}
                </p>
              </div>
              <div className="p-3 bg-accent rounded-lg text-left">
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
                <Button className="w-full">Back to Course</Button>
              </Link>
              <Button variant="outline" onClick={resetQuiz} className="w-full">
                Retry Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
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
        <Progress value={(currentQ / questions.length) * 100} className="h-2" />
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground">
            {question.question}
          </h2>

          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedOption(idx)}
                className={`w-full text-left p-4 rounded-lg border-2 text-sm transition-colors ${
                  selectedOption === idx
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border hover:border-primary/30 text-foreground"
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
            className="w-full"
          >
            {currentQ < questions.length - 1 ? "Proceed" : "Finish Quiz"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

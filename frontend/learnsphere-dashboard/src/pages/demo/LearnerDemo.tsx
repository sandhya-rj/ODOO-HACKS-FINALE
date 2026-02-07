/**
 * Learner Demo Page
 * 
 * Demonstrates learner-side experience with adaptive insights.
 * Shows quiz submission and lesson completion with alert triggering.
 */

import { useState } from 'react';
import { ArrowLeft, BookOpen, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCard } from '@/components/insights/AlertCard';
import { api } from '@/lib/api';
import type { Alert as InsightAlert } from '@/lib/api';

export default function LearnerDemo() {
  const [quizAlert, setQuizAlert] = useState<InsightAlert | null>(null);
  const [lessonAlert, setLessonAlert] = useState<InsightAlert | null>(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [isCompletingLesson, setIsCompletingLesson] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  async function handleQuizSubmit() {
    setIsSubmittingQuiz(true);
    setQuizAlert(null);
    
    try {
      const result = await api.quiz.submit({
        attempts: 4, // Guaranteed to trigger LEARNER_STRUGGLE
        timeSpent: 2000,
        score: 33.33,
      });
      
      setQuizSubmitted(true);
      
      if (result.alert) {
        setQuizAlert(result.alert);
      }
    } catch (error) {
      console.error('Quiz submission failed:', error);
    } finally {
      setIsSubmittingQuiz(false);
    }
  }

  async function handleLessonComplete() {
    setIsCompletingLesson(true);
    setLessonAlert(null);
    
    try {
      const result = await api.lesson.complete({
        timeSpent: 2000, // 33 minutes
        expectedTime: 840, // 14 minutes - Guaranteed to trigger LESSON_PACING_SLOW
      });
      
      setLessonCompleted(true);
      
      if (result.alert) {
        setLessonAlert(result.alert);
      }
    } catch (error) {
      console.error('Lesson completion failed:', error);
    } finally {
      setIsCompletingLesson(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Noah Davis - Learner View
          </h1>
          <p className="text-slate-600">
            Struggling learner experiencing adaptive insights in real-time
          </p>
        </div>

        <div className="space-y-6">
          {/* Quiz Submission Card */}
          <Card className="border-2 border-slate-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">JavaScript Fundamentals Quiz</CardTitle>
                    <CardDescription>Attempt #4</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Time Spent:</span>
                    <span className="ml-2 font-semibold text-slate-900">2000s (33 min)</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Score:</span>
                    <span className="ml-2 font-semibold text-slate-900">33.33%</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Previous Attempts:</span>
                    <span className="ml-2 font-semibold text-slate-900">3</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Status:</span>
                    <span className="ml-2 font-semibold text-red-600">Below Passing</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleQuizSubmit}
                disabled={isSubmittingQuiz || quizSubmitted}
                className="w-full"
                size="lg"
              >
                {isSubmittingQuiz ? 'Submitting...' : quizSubmitted ? 'Quiz Submitted' : 'Submit Quiz Attempt'}
              </Button>

              {quizSubmitted && !quizAlert && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">
                    ✓ Quiz submitted successfully!
                  </AlertDescription>
                </Alert>
              )}

              {quizAlert && (
                <div>
                  <AlertCard alert={quizAlert} />
                  <p className="text-sm text-slate-600 mt-2 px-4">
                    Instructor has been notified to provide support
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lesson Completion Card */}
          <Card className="border-2 border-slate-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Introduction to JavaScript</CardTitle>
                    <CardDescription>Video Lesson</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Expected Duration:</span>
                    <span className="ml-2 font-semibold text-slate-900">840s (14 min)</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Your Time:</span>
                    <span className="ml-2 font-semibold text-red-600">2000s (33 min)</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Difference:</span>
                    <span className="ml-2 font-semibold text-red-600">+1160s (+138%)</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Status:</span>
                    <span className="ml-2 font-semibold text-amber-600">Taking Longer</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleLessonComplete}
                disabled={isCompletingLesson || lessonCompleted}
                className="w-full"
                size="lg"
                variant="outline"
              >
                {isCompletingLesson ? 'Completing...' : lessonCompleted ? 'Lesson Completed' : 'Mark Lesson Complete'}
              </Button>

              {lessonCompleted && !lessonAlert && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">
                    ✓ Lesson marked as complete!
                  </AlertDescription>
                </Alert>
              )}

              {lessonAlert && (
                <div>
                  <AlertCard alert={lessonAlert} />
                  <p className="text-sm text-slate-600 mt-2 px-4">
                    Consider reviewing this material or requesting help
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Link to="/demo/instructor">
              <Button>
                View Instructor Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Plus, Trash2, CheckCircle2, Circle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { mockQuizQuestions } from "@/data/mockData";

export default function QuizBuilder() {
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const questions = mockQuizQuestions;
  const question = questions[selectedQuestion];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quiz Builder</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage quiz questions
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Question List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm">
                Questions ({questions.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuestion(idx)}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                    selectedQuestion === idx
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <span className="font-medium">Q{idx + 1}.</span>{" "}
                  <span className="line-clamp-2">{q.question}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Question Editor */}
        <div className="lg:col-span-6">
          <Card>
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">
                  Question {selectedQuestion + 1}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label>Question Text</Label>
                <Textarea
                  defaultValue={question.question}
                  rows={3}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label className="mb-3 block">Answer Options</Label>
                <div className="space-y-2">
                  {question.options.map((option, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <button className="flex-shrink-0">
                        {idx === question.correctAnswer ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                        )}
                      </button>
                      <Input defaultValue={option} className="flex-1" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-3">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Option
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rewards Panel */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Award className="h-4 w-4 text-warning" />
                Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div>
                <Label className="text-xs">1st Attempt</Label>
                <Input type="number" defaultValue="100" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">2nd Attempt</Label>
                <Input type="number" defaultValue="70" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">3rd Attempt</Label>
                <Input type="number" defaultValue="50" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">4th+ Attempt</Label>
                <Input type="number" defaultValue="10" className="mt-1" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

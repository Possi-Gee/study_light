'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, RefreshCw, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const quizData = {
  title: 'General Knowledge Quiz',
  questions: [
    {
      question: 'What is the capital of France?',
      options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
      answer: 'Paris',
    },
    {
      question: 'Which planet is known as the Red Planet?',
      options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
      answer: 'Mars',
    },
    {
      question: 'What is the largest ocean on Earth?',
      options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
      answer: 'Pacific Ocean',
    },
     {
      question: 'Who wrote "To Kill a Mockingbird"?',
      options: ['Harper Lee', 'Mark Twain', 'F. Scott Fitzgerald', 'Ernest Hemingway'],
      answer: 'Harper Lee',
    },
  ],
};

type AnswersState = { [key: number]: string };

export default function QuizzesPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: value }));
  };

  const score = Object.keys(answers).reduce((acc, key) => {
    const qIndex = parseInt(key, 10);
    if (answers[qIndex] === quizData.questions[qIndex].answer) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    return (
      <AppLayout>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
            <CardDescription>You scored {score} out of {quizData.questions.length}!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quizData.questions.map((q, index) => (
              <div key={index} className="p-4 border rounded-md bg-muted/30">
                <p className="font-semibold">{index + 1}. {q.question}</p>
                <div className="flex items-center mt-2">
                  {answers[index] === q.answer ? (
                    <CheckCircle className="h-5 w-5 text-success mr-2 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive mr-2 shrink-0" />
                  )}
                  <p className={answers[index] === q.answer ? 'text-success' : 'text-destructive'}>
                    Your answer: {answers[index] || 'Not answered'}. Correct answer: {q.answer}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button onClick={restartQuiz}>
              <RefreshCw className="mr-2 h-4 w-4"/>
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{quizData.title}</h1>
          <p className="text-muted-foreground">Question {currentQuestion + 1} of {quizData.questions.length}</p>
        </div>
        <Progress value={((currentQuestion + 1) / quizData.questions.length) * 100} />
        <Card>
          <CardHeader>
            <CardTitle>{quizData.questions[currentQuestion].question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup onValueChange={handleAnswerSelect} value={answers[currentQuestion]} className="gap-4">
              {quizData.questions[currentQuestion].options.map((option) => (
                <Label key={option} htmlFor={option} className="flex items-center space-x-3 p-4 border rounded-md hover:bg-muted/50 has-[input:checked]:bg-muted has-[input:checked]:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value={option} id={option} />
                  <span className="text-base">{option}</span>
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentQuestion(q => q - 1)} disabled={currentQuestion === 0}>
                <ArrowLeft className="mr-2 h-4 w-4"/> Previous
            </Button>
            {currentQuestion < quizData.questions.length - 1 ? (
              <Button onClick={() => setCurrentQuestion(q => q + 1)}>
                Next <ArrowRight className="ml-2 h-4 w-4"/>
              </Button>
            ) : (
              <Button onClick={() => setShowResults(true)} disabled={!answers[currentQuestion]}>Finish Quiz</Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}

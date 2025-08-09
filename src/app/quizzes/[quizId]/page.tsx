
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, RefreshCw, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Quiz } from '@/lib/quiz-store';
import { getQuizById, addQuizSubmission } from '@/services/quizzes-service';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

type AnswersState = { [key: number]: string };

export default function QuizTakingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const quizId = params.quizId as string;
  
  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    async function fetchQuiz() {
      if (!quizId) return;
      setLoading(true);
      try {
        const fetchedQuiz = await getQuizById(quizId);
        setQuizData(fetchedQuiz);
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
        setQuizData(null); // Ensure quizData is null on error
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [quizId]);

  const score = Object.keys(answers).reduce((acc, key) => {
    const qIndex = parseInt(key, 10);
    if (answers[qIndex] === quizData?.questions[qIndex].correctAnswer) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const handleFinishQuiz = async () => {
    if (!user || !quizData) return;
    setIsSubmitting(true);

    try {
      await addQuizSubmission({
        studentId: user.uid,
        studentName: user.displayName || 'Anonymous',
        quizId: quizData.id,
        quizTitle: quizData.title,
        score: score,
        totalQuestions: quizData.questions.length,
      });
      setShowResults(true);
    } catch (error) {
       console.error("Failed to submit quiz results:", error);
       toast({
         variant: "destructive",
         title: "Submission Failed",
         description: "Your results could not be saved. Please try again.",
       });
    } finally {
      setIsSubmitting(false);
    }
  }


  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!quizData) {
     return (
      <AppLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Quiz not found</h1>
          <p className="text-muted-foreground">This quiz may have been removed or does not exist.</p>
          <Link href="/quizzes">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Quizzes
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const handleAnswerSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: value }));
  };

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
            <CardTitle>Quiz Results for "{quizData.title}"</CardTitle>
            <CardDescription>You scored {score} out of {quizData.questions.length}!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quizData.questions.map((q, index) => (
              <div key={index} className="p-4 border rounded-md bg-muted/30">
                <p className="font-semibold">{index + 1}. {q.text}</p>
                <div className="flex items-center mt-2">
                  {answers[index] === q.correctAnswer ? (
                    <CheckCircle className="h-5 w-5 text-success mr-2 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive mr-2 shrink-0" />
                  )}
                  <p className={answers[index] === q.correctAnswer ? 'text-success' : 'text-destructive'}>
                    Your answer: {answers[index] || 'Not answered'}. Correct answer: {q.correctAnswer}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex-col sm:flex-row gap-2">
            <Button onClick={restartQuiz}>
              <RefreshCw className="mr-2 h-4 w-4"/>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => router.push('/quizzes')}>
                <ArrowLeft className="mr-2 h-4 w-4"/>
                Back to Quizzes
            </Button>
          </CardFooter>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
         <Link href="/quizzes" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4"/>
            Back to Quizzes List
        </Link>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{quizData.title}</h1>
          <p className="text-muted-foreground">Question {currentQuestion + 1} of {quizData.questions.length}</p>
        </div>
        <Progress value={((currentQuestion + 1) / quizData.questions.length) * 100} />
        <Card>
          <CardHeader>
            <CardTitle>{quizData.questions[currentQuestion].text}</CardTitle>
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
              <Button onClick={handleFinishQuiz} disabled={Object.keys(answers).length !== quizData.questions.length || isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                Finish Quiz
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}

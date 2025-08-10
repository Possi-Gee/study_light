
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useEffect, useState, useLayoutEffect, useRef, useCallback } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Download, Loader2, RefreshCw, Timer, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Quiz } from '@/lib/quiz-store';
import { getQuizById, addQuizSubmission } from '@/services/quizzes-service';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import ReactConfetti from 'react-confetti';
import { Certificate } from '@/components/certificate';
import * as htmlToImage from 'html-to-image';
import { format } from 'date-fns';

type AnswersState = { [key: number]: string };

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

const QuizTimer = ({ initialMinutes, onTimeUp }: { initialMinutes: number, onTimeUp: () => void }) => {
    const [seconds, setSeconds] = useState(initialMinutes * 60);

    useEffect(() => {
        if (seconds <= 0) {
            onTimeUp();
            return;
        }
        const timer = setInterval(() => {
            setSeconds(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [seconds, onTimeUp]);

    const displayMinutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;
    const isLowTime = seconds < 60;

    return (
        <div className={`flex items-center gap-2 font-semibold p-2 rounded-md ${isLowTime ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`}>
            <Timer className="h-5 w-5"/>
            <span>
                {String(displayMinutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
            </span>
        </div>
    );
};


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
  const hasSubmitted = useRef(false);

  const { width, height } = useWindowSize();
  const certificateRef = useRef<HTMLDivElement>(null);

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
  
  const scorePercentage = quizData && quizData.questions.length > 0 ? Math.round((score / quizData.questions.length) * 100) : 0;


  const handleFinishQuiz = useCallback(async (timedOut = false) => {
    if (!user || !quizData || hasSubmitted.current) return;
    
    hasSubmitted.current = true;
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
      if (timedOut) {
          toast({
              variant: "destructive",
              title: "Time's Up!",
              description: "Your quiz has been submitted automatically.",
          });
      }
    } catch (error) {
       console.error("Failed to submit quiz results:", error);
       toast({
         variant: "destructive",
         title: "Submission Failed",
         description: "Your results could not be saved. Please try again.",
       });
       hasSubmitted.current = false; // Allow retry on failure
    } finally {
      setIsSubmitting(false);
    }
  }, [user, quizData, score, toast]);


  const handleDownloadCertificate = async () => {
    if (!certificateRef.current) return;

    try {
        const dataUrl = await htmlToImage.toPng(certificateRef.current, { 
            cacheBust: true,
            filter: (node) => {
                if (node.tagName === 'LINK' && (node as HTMLLinkElement).href.includes('fonts.googleapis.com')) {
                    return false;
                }
                return true;
            },
        });
        const link = document.createElement('a');
        link.download = `certificate-${quizData?.title.replace(/\s+/g, '-')}.png`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error('oops, something went wrong!', err);
        toast({
            variant: "destructive",
            title: "Download Failed",
            description: "Could not generate the certificate image.",
        });
    }
  };


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
    hasSubmitted.current = false;
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    const isPassing = scorePercentage >= 70;
    return (
      <AppLayout>
        <div className="w-full flex justify-center p-4">
            <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
                {isPassing && <ReactConfetti width={width} height={height} recycle={false} numberOfPieces={500} />}
                
                <div className="w-full max-w-2xl text-center">
                    {isPassing ? (
                        <>
                            <h2 className="text-2xl font-bold mb-4">Congratulations! You earned a certificate.</h2>
                            <Certificate
                                ref={certificateRef}
                                studentName={user?.displayName || 'Student'}
                                quizTitle={quizData.title}
                                score={`${scorePercentage}%`}
                                date={format(new Date(), 'MMMM dd, yyyy')}
                                />
                        </>
                    ) : (
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold tracking-tight">Almost there!</h2>
                            <p className="text-muted-foreground mt-2">
                                Review your results below. Score 70% or higher to earn a certificate.
                            </p>
                        </div>
                    )}
                </div>

                <Card className="w-full">
                <CardHeader>
                    <CardTitle>Quiz Results for "{quizData.title}"</CardTitle>
                    <CardDescription>You scored {scorePercentage}% ({score} out of {quizData.questions.length})!</CardDescription>
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
                    {isPassing && (
                        <Button variant="default" onClick={handleDownloadCertificate}>
                            <Download className="mr-2 h-4 w-4"/>
                            Download Certificate
                        </Button>
                    )}
                </CardFooter>
                </Card>
            </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="w-full flex justify-center p-4">
        <div className="w-full max-w-2xl space-y-6">
            <Link href="/quizzes" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="mr-2 h-4 w-4"/>
                Back to Quizzes List
            </Link>
             <div className="space-y-2 text-center relative">
                <h1 className="text-3xl font-bold tracking-tight">{quizData.title}</h1>
                <p className="text-muted-foreground">Question {currentQuestion + 1} of {quizData.questions.length}</p>
                 {quizData.timer && (
                    <div className="absolute top-0 right-0">
                         <QuizTimer initialMinutes={quizData.timer} onTimeUp={() => handleFinishQuiz(true)} />
                    </div>
                )}
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
                <Button onClick={() => handleFinishQuiz(false)} disabled={Object.keys(answers).length !== quizData.questions.length || isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    Finish Quiz
                </Button>
                )}
            </CardFooter>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}

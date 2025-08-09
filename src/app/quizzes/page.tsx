
'use client';

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuizStore } from "@/lib/quiz-store";
import { ArrowRight, FileQuestion } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function QuizzesPage() {
  const { quizzes } = useQuizStore();

  const quizzesBySubject = useMemo(() => {
    return quizzes.reduce((acc, quiz) => {
        if (quiz.questions.length === 0) return acc; // Don't show empty quizzes
        (acc[quiz.subject] = acc[quiz.subject] || []).push(quiz);
        return acc;
    }, {} as Record<string, typeof quizzes>);
  }, [quizzes]);

  const subjects = Object.keys(quizzesBySubject);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Practice Quizzes</h1>
          <p className="text-muted-foreground">Test your knowledge and track your progress.</p>
        </div>

        {subjects.length > 0 ? (
            <div className="space-y-8">
                {subjects.map(subject => (
                    <div key={subject}>
                        <h2 className="text-2xl font-semibold tracking-tight mb-4">{subject}</h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {quizzesBySubject[subject].map(quiz => (
                                <Card key={quiz.id} className="flex flex-col">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="leading-tight">{quiz.title}</CardTitle>
                                            <FileQuestion className="h-6 w-6 text-primary shrink-0 ml-4"/>
                                        </div>
                                        <CardDescription>{quiz.questions.length} question(s)</CardDescription>
                                    </CardHeader>
                                    <CardContent className="mt-auto pt-0">
                                         <Link href={`/quizzes/${quiz.id}`}>
                                            <Button className="w-full">
                                                Start Quiz <ArrowRight className="ml-2"/>
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
             <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No quizzes are available at the moment.</p>
                <p className="text-sm text-muted-foreground mt-2">Please check back later or ask your teacher to create one.</p>
            </div>
        )}

      </div>
    </AppLayout>
  );
}

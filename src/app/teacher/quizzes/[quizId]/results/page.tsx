
'use client';
import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Quiz, QuizSubmission, getQuizById, getSubmissionsForQuiz } from "@/services/quizzes-service";
import { getInitials } from "@/lib/utils";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";

export default function QuizResultsPage() {
    const params = useParams();
    const quizId = params.quizId as string;
    
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [results, setResults] = useState<QuizSubmission[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchQuizData = useCallback(async () => {
        if (!quizId) return;
        setLoading(true);
        try {
            const [fetchedQuiz, fetchedResults] = await Promise.all([
                getQuizById(quizId),
                getSubmissionsForQuiz(quizId)
            ]);
            setQuiz(fetchedQuiz);
            setResults(fetchedResults);
        } catch (error) {
            console.error("Failed to fetch quiz data:", error);
        } finally {
            setLoading(false);
        }
    }, [quizId]);

    useEffect(() => {
        fetchQuizData();
    }, [fetchQuizData]);

    if (loading) {
        return (
            <AppLayout>
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </AppLayout>
        );
    }

    if (!quiz) {
        return (
            <AppLayout>
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Quiz not found</h1>
                    <p className="text-muted-foreground">The quiz you are looking for does not exist.</p>
                    <Link href="/teacher/quizzes">
                        <Button variant="outline" className="mt-4">
                            <ArrowLeft className="mr-2 h-4 w-4"/>
                            Back to Quizzes
                        </Button>
                    </Link>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="space-y-8">
                <div>
                    <Link href="/teacher/quizzes" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        Back to Quizzes
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Results for "{quiz.title}"</h1>
                    <p className="text-muted-foreground">A summary of student performance on this quiz.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Student Submissions</CardTitle>
                        <CardDescription>
                            {results.length > 0
                                ? `Showing ${results.length} result(s).`
                                : "No students have completed this quiz yet."
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Date Completed</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results.map(result => {
                                    const scorePercentage = result.totalQuestions > 0 ? Math.round((result.score / result.totalQuestions) * 100) : 0;
                                    return (
                                        <TableRow key={result.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        {/* This assumes user profile has photoURL, which needs to be fetched */}
                                                        {/* <AvatarImage src={result.studentAvatarUrl} alt={result.studentName} /> */}
                                                        <AvatarFallback>{getInitials(result.studentName)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{result.studentName}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold text-lg">{scorePercentage}%</TableCell>
                                            <TableCell className="text-muted-foreground">{format(result.completedAt.toDate(), 'PPp')}</TableCell>
                                        </TableRow>
                                    )
                                })}
                                 {results.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">
                                            No results to display.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </div>
        </AppLayout>
    )
}

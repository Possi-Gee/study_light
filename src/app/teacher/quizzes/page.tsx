
'use client';
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Quiz } from "@/lib/quiz-store";
import { deleteQuiz, getQuizzes } from "@/services/quizzes-service";
import { FileQuestion, PlusCircle, Trash2, Edit, BarChart, Loader2, Timer } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function TeacherQuizzesPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingQuizId, setDeletingQuizId] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchQuizzes = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedQuizzes = await getQuizzes();
            setQuizzes(fetchedQuizzes);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not fetch quizzes." });
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchQuizzes();
    }, [fetchQuizzes]);

    const handleDeleteQuiz = async () => {
        if (!deletingQuizId) return;
        try {
            await deleteQuiz(deletingQuizId);
            toast({ title: "Success", description: "Quiz deleted." });
            fetchQuizzes(); // Refresh the list
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not delete quiz." });
        } finally {
            setDeletingQuizId(null);
        }
    }

    return (
        <AppLayout>
            <AlertDialog open={!!deletingQuizId} onOpenChange={(open) => !open && setDeletingQuizId(null)}>
                <div className="space-y-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Manage Quizzes</h1>
                            <p className="text-muted-foreground">Create, edit, and review quizzes for your students.</p>
                        </div>
                        <Link href="/teacher/quizzes/create">
                            <Button>
                                <PlusCircle className="mr-2"/> Create Quiz
                            </Button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : quizzes.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {quizzes.map(quiz => (
                                <Card key={quiz.id} className="flex flex-col">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="leading-tight">{quiz.title}</CardTitle>
                                            <FileQuestion className="h-6 w-6 text-primary shrink-0 ml-4"/>
                                        </div>
                                        <div className="text-sm text-muted-foreground flex items-center gap-4">
                                            <span>{quiz.subject} - {quiz.questions.length} question(s)</span>
                                            {quiz.timer && (
                                                <div className="flex items-center gap-1">
                                                    <Timer className="h-4 w-4"/>
                                                    <span>{quiz.timer} min</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                    </CardContent>
                                    <CardFooter className="flex justify-between items-center mt-auto">
                                        <div className="flex gap-2">
                                            <Link href={`/teacher/quizzes/${quiz.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="mr-2 h-4 w-4"/> Edit
                                                </Button>
                                            </Link>
                                        </div>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-9 w-9" onClick={() => setDeletingQuizId(quiz.id)}>
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </AlertDialogTrigger>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">You haven't created any quizzes yet.</p>
                            <Link href="/teacher/quizzes/create">
                                <Button className="mt-4"><PlusCircle className="mr-2"/> Create Your First Quiz</Button>
                            </Link>
                        </div>
                    )}
                </div>
                 <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the quiz and all associated submissions.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeletingQuizId(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteQuiz}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}


'use client';
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, BrainCircuit, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// Mock data, in a real app this would be fetched
const initialQuizzes = {
    "quiz-1": {
        title: "Algebra Basics",
        description: "A quick quiz to test fundamental algebra concepts.",
    },
    "quiz-2": {
        title: "The Roman Empire",
        description: "Test your knowledge on the history of ancient Rome.",
    },
     "quiz-3": {
        title: "Introduction to Psychology",
        description: "A quiz covering basic concepts in psychology.",
    }
};

export default function EditQuizPage() {
    const router = useRouter();
    const params = useParams();
    const quizId = params.quizId as keyof typeof initialQuizzes;
    const quizData = initialQuizzes[quizId];

    const handleSaveQuiz = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Quiz saved!");
        router.push('/teacher/quizzes');
    };

    if (!quizData) {
        return (
             <AppLayout>
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Quiz not found</h1>
                    <p className="text-muted-foreground">The quiz you are trying to edit does not exist.</p>
                     <Link href="/teacher/quizzes">
                        <Button variant="outline" className="mt-4">
                            <ArrowLeft className="mr-2 h-4 w-4"/>
                            Back to Quizzes
                        </Button>
                    </Link>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="space-y-8 max-w-4xl mx-auto">
                <div>
                    <Link href="/teacher/quizzes" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        Back to Quizzes
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Quiz</h1>
                    <p className="text-muted-foreground">Modify the details and questions for your quiz.</p>
                </div>

                <form onSubmit={handleSaveQuiz} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quiz Details</CardTitle>
                            <CardDescription>Update the title and description for your quiz.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Quiz Title</Label>
                                <Input id="title" name="title" defaultValue={quizData.title} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" defaultValue={quizData.description} required rows={3} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Questions</CardTitle>
                            <CardDescription>Add, edit, or remove questions for this quiz.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-md">
                                <p>Question management UI coming soon!</p>
                            </div>
                            <div className="flex justify-center gap-4">
                                <Button type="button" variant="outline">
                                    <PlusCircle className="mr-2"/> Add Question Manually
                                </Button>
                                <Button type="button">
                                    <BrainCircuit className="mr-2"/> Generate Questions with AI
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                     <div className="flex justify-end">
                        <Button type="submit" size="lg">Save Changes</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}


'use client';
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, BrainCircuit, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateQuizPage() {
    const router = useRouter();

    const handleSaveQuiz = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically handle form submission,
        // save the data, and then redirect.
        console.log("Quiz saved!");
        router.push('/teacher/quizzes');
    };

    return (
        <AppLayout>
            <div className="space-y-8 max-w-4xl mx-auto">
                <div>
                    <Link href="/teacher/quizzes" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        Back to Quizzes
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Create a New Quiz</h1>
                    <p className="text-muted-foreground">Fill out the details below to create a new quiz for your students.</p>
                </div>

                <form onSubmit={handleSaveQuiz} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quiz Details</CardTitle>
                            <CardDescription>Provide a title and a short description for your quiz.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Quiz Title</Label>
                                <Input id="title" name="title" placeholder="e.g. World History: The Middle Ages" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" placeholder="A brief overview of what this quiz covers." required rows={3} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Questions</CardTitle>
                            <CardDescription>Add questions to your quiz manually or generate them with AI.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-md">
                                <p>You haven't added any questions yet.</p>
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
                        <Button type="submit" size="lg">Save Quiz</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

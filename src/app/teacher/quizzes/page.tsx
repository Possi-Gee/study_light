
'use client';
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion, PlusCircle, Trash2, Edit, BarChart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type QuizQuestion = {
    id: string;
    question: string;
    options: string[];
    answer: string;
};

type Quiz = {
    id: string;
    title: string;
    subject: string;
    questions: QuizQuestion[];
};

const initialQuizzes: Quiz[] = [
    {
        id: "quiz-1",
        title: "Algebra Basics",
        subject: "Mathematics",
        questions: [
            { id: "q-1", question: "Solve for x: 2x + 3 = 11", options: ["3", "4", "5", "6"], answer: "4" },
            { id: "q-2", question: "What is (x+y)^2?", options: ["x^2 + y^2", "x^2 + 2xy + y^2", "x^2 - 2xy + y^2", "2x + 2y"], answer: "x^2 + 2xy + y^2" },
        ]
    },
    {
        id: "quiz-2",
        title: "The Roman Empire",
        subject: "History",
        questions: [
            { id: "q-3", question: "Who was the first Roman Emperor?", options: ["Julius Caesar", "Nero", "Augustus", "Constantine"], answer: "Augustus" },
            { id: "q-4", question: "When did the Western Roman Empire fall?", options: ["476 AD", "1453 AD", "44 BC", "753 BC"], answer: "476 AD" }
        ]
    },
    {
        id: "quiz-3",
        title: "Introduction to Psychology",
        subject: "Psychology",
        questions: []
    }
];


export default function TeacherQuizzesPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);

    const handleDeleteQuiz = (quizId: string) => {
        setQuizzes(quizzes.filter(q => q.id !== quizId));
    };

    return (
        <AppLayout>
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

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map(quiz => (
                        <Card key={quiz.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle className="leading-tight">{quiz.title}</CardTitle>
                                    <FileQuestion className="h-6 w-6 text-primary shrink-0 ml-4"/>
                                </div>
                                <CardDescription>{quiz.subject} - {quiz.questions.length} question(s)</CardDescription>
                            </CardHeader>
                             <CardContent className="flex-grow">
                                {/* <p className="text-sm text-muted-foreground line-clamp-3">{quiz.description}</p> */}
                            </CardContent>
                            <CardFooter className="flex justify-between items-center mt-auto">
                                <div className="flex gap-2">
                                    <Link href={`/teacher/quizzes/${quiz.id}/edit`}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="mr-2 h-4 w-4"/> Edit
                                        </Button>
                                    </Link>
                                    <Link href={`/teacher/quizzes/${quiz.id}/results`}>
                                        <Button variant="outline" size="sm">
                                            <BarChart className="mr-2 h-4 w-4"/> Results
                                        </Button>
                                    </Link>
                                </div>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-9 w-9" onClick={() => handleDeleteQuiz(quiz.id)}>
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                 {quizzes.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">You haven't created any quizzes yet.</p>
                        <Link href="/teacher/quizzes/create">
                            <Button className="mt-4"><PlusCircle className="mr-2"/> Create Your First Quiz</Button>
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

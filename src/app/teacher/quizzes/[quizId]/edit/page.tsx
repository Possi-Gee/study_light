
'use client';
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, BrainCircuit, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// Mock data, in a real app this would be fetched
const initialQuizzes: { [key: string]: QuizData } = {
    "quiz-1": {
        title: "Algebra Basics",
        description: "A quick quiz to test fundamental algebra concepts.",
        questions: [
            { id: "q-1", text: "Solve for x: 2x + 3 = 11", options: ["3", "4", "5", "6"], correctAnswer: "4" },
            { id: "q-2", text: "What is (x+y)^2?", options: ["x^2 + y^2", "x^2 + 2xy + y^2", "x^2 - 2xy + y^2", "2x + 2y"], correctAnswer: "x^2 + 2xy + y^2" },
        ]
    },
    "quiz-2": {
        title: "The Roman Empire",
        description: "Test your knowledge on the history of ancient Rome.",
        questions: []
    },
     "quiz-3": {
        title: "Introduction to Psychology",
        description: "A quiz covering basic concepts in psychology.",
        questions: []
    }
};

type Question = {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
};

type QuizData = {
    title: string;
    description: string;
    questions: Question[];
}

export default function EditQuizPage() {
    const router = useRouter();
    const params = useParams();
    const quizId = params.quizId as keyof typeof initialQuizzes;
    const quizData = initialQuizzes[quizId];
    
    const [questions, setQuestions] = useState<Question[]>(quizData?.questions || []);

    const handleSaveQuiz = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Quiz saved!", { questions });
        router.push('/teacher/quizzes');
    };
    
    const addQuestion = () => {
        setQuestions(prev => [...prev, {
            id: `q-${Date.now()}`,
            text: "",
            options: ["", "", "", ""],
            correctAnswer: ""
        }]);
    };

    const removeQuestion = (id: string) => {
        setQuestions(prev => prev.filter(q => q.id !== id));
    };

    const handleQuestionChange = (id: string, field: 'text' | 'correctAnswer', value: string) => {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    const handleOptionChange = (id: string, optionIndex: number, value: string) => {
        setQuestions(prev => prev.map(q => {
            if (q.id === id) {
                const newOptions = [...q.options];
                newOptions[optionIndex] = value;
                return { ...q, options: newOptions };
            }
            return q;
        }));
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
                            {questions.map((q, index) => (
                                <div key={q.id} className="p-4 border rounded-lg relative space-y-4 bg-muted/30">
                                    <Button variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7" onClick={() => removeQuestion(q.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <div className="space-y-2">
                                        <Label htmlFor={`question-${q.id}`}>Question {index + 1}</Label>
                                        <Textarea id={`question-${q.id}`} value={q.text} onChange={e => handleQuestionChange(q.id, 'text', e.target.value)} placeholder="What is 2 + 2?" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[0, 1, 2, 3].map(i => (
                                             <div key={i} className="space-y-2">
                                                <Label htmlFor={`q-${q.id}-option-${i}`}>Option {i + 1}</Label>
                                                <Input id={`q-${q.id}-option-${i}`} value={q.options[i]} onChange={e => handleOptionChange(q.id, i, e.target.value)} placeholder={`Option ${i+1}`} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Correct Answer</Label>
                                        <Select value={q.correctAnswer} onValueChange={value => handleQuestionChange(q.id, 'correctAnswer', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select the correct answer" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {q.options.map((opt, i) => opt && <SelectItem key={i} value={opt}>{opt}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            ))}

                            {questions.length === 0 && (
                                 <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-md">
                                    <p>You haven't added any questions yet.</p>
                                </div>
                            )}
                            
                            <div className="flex justify-center gap-4">
                                <Button type="button" variant="outline" onClick={addQuestion}>
                                    <PlusCircle className="mr-2"/> Add Question Manually
                                </Button>
                                <Button type="button">
                                    <BrainCircuit className="mr-2"/> Generate Questions with AI
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                     <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => router.push('/teacher/quizzes')}>Cancel</Button>
                        <Button type="submit" size="lg">Save Quiz</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

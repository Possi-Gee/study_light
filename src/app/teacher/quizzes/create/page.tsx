
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
import { useRouter } from "next/navigation";
import { useState } from "react";

type Question = {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
};

const subjects = [ "Mathematics", "Science", "History", "Psychology" ];

export default function CreateQuizPage() {
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [subject, setSubject] = useState('');

    const handleSaveQuiz = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically handle form submission,
        // save the data, and then redirect.
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
                            <CardDescription>Provide a title and select a subject for your quiz.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Quiz Title</Label>
                                <Input id="title" name="title" placeholder="e.g. World History: The Middle Ages" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Select name="subject" value={subject} onValueChange={setSubject}>
                                    <SelectTrigger id="subject">
                                        <SelectValue placeholder="Select a subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Questions</CardTitle>
                            <CardDescription>Add questions to your quiz manually or generate them with AI.</CardDescription>
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

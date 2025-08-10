
'use client';
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Quiz, QuizQuestion } from "@/lib/quiz-store";
import { getQuizById, updateQuiz } from "@/services/quizzes-service";
import { ArrowLeft, BrainCircuit, Loader2, PlusCircle, Timer, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Subject, getSubjects } from "@/services/notes-service";
import { GenerateQuestionsDialog } from "@/components/generate-questions-dialog";

export default function EditQuizPage() {
    const router = useRouter();
    const params = useParams();
    const quizId = params.quizId as string;
    const { toast } = useToast();
    
    const [quizData, setQuizData] = useState<Quiz | null>(null);
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [timer, setTimer] = useState<number | undefined>(undefined);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

    useEffect(() => {
        async function fetchSubjects() {
            try {
                const fetchedSubjects = await getSubjects();
                setSubjects(fetchedSubjects);
            } catch (error) {
                console.error("Failed to fetch subjects:", error);
                toast({ variant: "destructive", title: "Error", description: "Failed to load subjects." });
            }
        }
        fetchSubjects();
    }, [toast]);

    const fetchQuiz = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedQuiz = await getQuizById(quizId);
            if(fetchedQuiz) {
                setQuizData(fetchedQuiz);
                setTitle(fetchedQuiz.title);
                setSubject(fetchedQuiz.subject);
                setQuestions(fetchedQuiz.questions);
                setTimer(fetchedQuiz.timer);
            }
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Error", description: "Failed to fetch quiz data." });
        } finally {
            setLoading(false);
        }
    }, [quizId, toast]);

    useEffect(() => {
        if (quizId) {
            fetchQuiz();
        }
    }, [quizId, fetchQuiz]);

    const handleSaveQuiz = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateQuiz(quizId, { title, subject, questions, timer });
            toast({ title: "Success!", description: "Quiz updated successfully." });
            router.push('/teacher/quizzes');
        } catch(error) {
            console.error(error);
            toast({ variant: "destructive", title: "Error", description: "Could not update quiz." });
        } finally {
            setSaving(false);
        }
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
    
    const handleAiQuestionsGenerated = (generatedQuestions: QuizQuestion[]) => {
        setQuestions(prev => [...prev, ...generatedQuestions]);
        toast({
            title: "Success!",
            description: `${generatedQuestions.length} questions have been added to your quiz.`
        })
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
            <div className="flex flex-col space-y-8 w-full">
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
                            <CardDescription>Update the title, subject, and timer for your quiz.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Quiz Title</Label>
                                <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Select name="subject" value={subject} onValueChange={setSubject} required>
                                    <SelectTrigger id="subject">
                                        <SelectValue placeholder="Select a subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="timer">Timer (minutes)</Label>
                                <div className="relative">
                                    <Timer className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
                                    <Input 
                                        id="timer" 
                                        name="timer" 
                                        type="number" 
                                        placeholder="Optional: e.g., 30" 
                                        value={timer === undefined ? '' : timer} 
                                        onChange={(e) => setTimer(e.target.value ? parseInt(e.target.value, 10) : undefined)} 
                                        className="pl-10"
                                    />
                                </div>
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
                                    <Button type="button" variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7" onClick={() => removeQuestion(q.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <div className="space-y-2">
                                        <Label htmlFor={`question-${q.id}`}>Question {index + 1}</Label>
                                        <Textarea id={`question-${q.id}`} value={q.text} onChange={e => handleQuestionChange(q.id, 'text', e.target.value)} placeholder="What is 2 + 2?" />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
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
                                <GenerateQuestionsDialog
                                    open={isAiDialogOpen}
                                    onOpenChange={setIsAiDialogOpen}
                                    onQuestionsGenerated={handleAiQuestionsGenerated}
                                >
                                    <Button type="button">
                                        <BrainCircuit className="mr-2"/> Generate Questions with AI
                                    </Button>
                                </GenerateQuestionsDialog>
                            </div>
                        </CardContent>
                    </Card>
                     <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => router.push('/teacher/quizzes')}>Cancel</Button>
                        <Button type="submit" size="lg" disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

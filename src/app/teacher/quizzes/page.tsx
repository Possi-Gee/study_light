
'use client';
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { FileQuestion, PlusCircle, Trash2, Edit, BarChart } from "lucide-react";
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
    description: string;
    questions: QuizQuestion[];
};

const initialQuizzes: Quiz[] = [
    {
        id: "quiz-1",
        title: "Algebra Basics",
        description: "A quick quiz to test fundamental algebra concepts.",
        questions: [
            { id: "q-1", question: "Solve for x: 2x + 3 = 11", options: ["3", "4", "5", "6"], answer: "4" },
            { id: "q-2", question: "What is (x+y)^2?", options: ["x^2 + y^2", "x^2 + 2xy + y^2", "x^2 - 2xy + y^2", "2x + 2y"], answer: "x^2 + 2xy + y^2" },
        ]
    },
    {
        id: "quiz-2",
        title: "The Roman Empire",
        description: "Test your knowledge on the history of ancient Rome.",
        questions: [
            { id: "q-3", question: "Who was the first Roman Emperor?", options: ["Julius Caesar", "Nero", "Augustus", "Constantine"], answer: "Augustus" },
            { id: "q-4", question: "When did the Western Roman Empire fall?", options: ["476 AD", "1453 AD", "44 BC", "753 BC"], answer: "476 AD" }
        ]
    },
    {
        id: "quiz-3",
        title: "Introduction to Psychology",
        description: "A quiz covering basic concepts in psychology.",
        questions: []
    }
];


export default function TeacherQuizzesPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);
    const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);

    const openQuizDialog = (quiz: Quiz | null = null) => {
        setEditingQuiz(quiz);
        if (quiz) {
            setCurrentQuestion(quiz.questions[0] || null);
        } else {
            setCurrentQuestion({ id: `q-${Date.now()}`, question: '', options: ['', '', '', ''], answer: '' });
        }
        setIsQuizDialogOpen(true);
    };

    const handleSaveQuiz = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        
        // In a real app, you would handle questions here.
        // For simplicity, we are only saving title and description from the main form.
        // Questions would be managed inside the dialog state.

        if (editingQuiz) {
             setQuizzes(quizzes.map(q => q.id === editingQuiz.id ? { ...q, title, description, questions: editingQuiz.questions } : q));
        } else {
            const newQuiz: Quiz = {
                id: `quiz-${Date.now()}`,
                title,
                description,
                questions: [],
            };
            setQuizzes([newQuiz, ...quizzes]);
        }
        setIsQuizDialogOpen(false);
        setEditingQuiz(null);
    };
    
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
                    <Button onClick={() => openQuizDialog()}>
                        <PlusCircle className="mr-2"/> Create Quiz
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map(quiz => (
                        <Card key={quiz.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle className="leading-tight">{quiz.title}</CardTitle>
                                    <FileQuestion className="h-6 w-6 text-primary shrink-0 ml-4"/>
                                </div>
                                <CardDescription>{quiz.questions.length} question(s)</CardDescription>
                            </CardHeader>
                             <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-3">{quiz.description}</p>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => openQuizDialog(quiz)} className="flex-1">
                                    <Edit className="mr-2 h-4 w-4"/> Edit
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                    <BarChart className="mr-2 h-4 w-4"/> Results
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive shrink-0 h-9 w-9" onClick={() => handleDeleteQuiz(quiz.id)}>
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                 {quizzes.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">You haven't created any quizzes yet.</p>
                        <Button className="mt-4" onClick={() => openQuizDialog()}><PlusCircle className="mr-2"/> Create Your First Quiz</Button>
                    </div>
                )}
            </div>

            {/* Quiz Editor/Creator Dialog */}
            <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{editingQuiz ? 'Edit Quiz' : 'Create a New Quiz'}</DialogTitle>
                    </DialogHeader>
                     <form onSubmit={handleSaveQuiz}>
                        <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Quiz Title</Label>
                                <Input id="title" name="title" defaultValue={editingQuiz?.title} placeholder="e.g. World History" required/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" defaultValue={editingQuiz?.description} placeholder="A short description of the quiz." required rows={2}/>
                            </div>

                            {/* Question Management would go here. This is a simplified version. */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Questions</CardTitle>
                                    <CardDescription>Add, edit, and manage the questions for this quiz.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-md">
                                        <p>Full question management is coming soon!</p>
                                        <p className="text-sm">For now, you can save the quiz title and description.</p>
                                    </div>
                                </CardContent>
                            </Card>

                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">{editingQuiz ? 'Save Changes' : 'Create Quiz'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

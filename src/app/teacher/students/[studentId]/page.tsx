
'use client';
import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Mail, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock data for demonstration purposes. In a real app, this would come from a database.
const studentsData = {
    "usr-1": { id: "usr-1", name: "Liam Johnson", email: "liam@example.com", avatar: "https://placehold.co/100x100.png", initials: "LJ", quizHistory: [
        { quizId: "quiz-1", quiz: "Algebra Basics", score: "8/10", date: "2024-07-28" },
        { quizId: "quiz-2", quiz: "The Roman Empire", score: "9/10", date: "2024-07-26" },
        { quizId: "quiz-gen", quiz: "General Knowledge Quiz", score: "3/4", date: "2024-07-21" },
    ]},
    "usr-2": { id: "usr-2", name: "Olivia Smith", email: "olivia@example.com", avatar: "https://placehold.co/100x100.png", initials: "OS", quizHistory: [
        { quizId: "quiz-1", quiz: "Algebra Basics", score: "10/10", date: "2024-07-28" },
    ]},
    "usr-3": { id: "usr-3", name: "Noah Williams", email: "noah@example.com", avatar: "https://placehold.co/100x100.png", initials: "NW", quizHistory: [
         { quizId: "quiz-2", quiz: "The Roman Empire", score: "7/10", date: "2024-07-26" },
    ]},
    "usr-4": { id: "usr-4", name: "Emma Brown", email: "emma@example.com", avatar: "https://placehold.co/100x100.png", initials: "EB", quizHistory: [
        { quizId: "quiz-1", quiz: "Algebra Basics", score: "6/10", date: "2024-07-27" },
    ]},
    "usr-5": { id: "usr-5", name: "Oliver Jones", email: "oliver@example.com", avatar: "https://placehold.co/100x100.png", initials: "OJ", quizHistory: [
        { quizId: "quiz-2", quiz: "The Roman Empire", score: "8/10", date: "2024-07-25" },
    ]},
};


export default function StudentProgressPage() {
    const params = useParams();
    const studentId = params.studentId as keyof typeof studentsData;
    const student = studentsData[studentId];

    if (!student) {
        return (
            <AppLayout>
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Student not found</h1>
                    <p className="text-muted-foreground">The student you are looking for does not exist.</p>
                    <Link href="/teacher/students">
                        <Button variant="outline" className="mt-4">
                            <ArrowLeft className="mr-2 h-4 w-4"/>
                            Back to Students List
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
                    <Link href="/teacher/students" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        Back to Students List
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Student Progress: {student.name}</h1>
                    <p className="text-muted-foreground">An overview of {student.name}'s performance and history.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    <Card className="md:col-span-1">
                        <CardHeader className="items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={student.avatar} alt={student.name} data-ai-hint="person portrait"/>
                                <AvatarFallback>{student.initials}</AvatarFallback>
                            </Avatar>
                            <CardTitle>{student.name}</CardTitle>
                            <CardDescription>{student.email}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center">
                                <User className="mr-2 h-4 w-4 text-muted-foreground"/>
                                <span>{student.name}</span>
                            </div>
                            <div className="flex items-center">
                                <Mail className="mr-2 h-4 w-4 text-muted-foreground"/>
                                <span>{student.email}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Quiz History</CardTitle>
                            <CardDescription>A summary of all quizzes this student has taken.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Quiz</TableHead>
                                        <TableHead>Score</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {student.quizHistory.length > 0 ? (
                                        student.quizHistory.map(item => (
                                            <TableRow key={item.quizId}>
                                                <TableCell className="font-medium">{item.quiz}</TableCell>
                                                <TableCell>{item.score}</TableCell>
                                                <TableCell>{item.date}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-24 text-center">
                                                This student has not taken any quizzes yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}

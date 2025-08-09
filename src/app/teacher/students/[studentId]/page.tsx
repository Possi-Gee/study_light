
'use client';
import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getInitials } from "@/lib/utils";
import { ArrowLeft, Loader2, Mail, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { UserProfile, getUserById } from "@/services/user-service";
import { QuizSubmission, getSubmissionsForStudent } from "@/services/quizzes-service";
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";


export default function StudentProgressPage() {
    const params = useParams();
    const studentId = params.studentId as string;
    
    const [student, setStudent] = useState<UserProfile | null>(null);
    const [quizHistory, setQuizHistory] = useState<QuizSubmission[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStudentData = useCallback(async () => {
        if (!studentId) return;
        setLoading(true);
        try {
            const [studentData, historyData] = await Promise.all([
                getUserById(studentId),
                getSubmissionsForStudent(studentId)
            ]);
            setStudent(studentData);
            setQuizHistory(historyData);
        } catch (error) {
            console.error("Failed to fetch student data:", error);
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    useEffect(() => {
        fetchStudentData();
    }, [fetchStudentData]);


    if (loading) {
        return (
            <AppLayout>
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </AppLayout>
        );
    }

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

                <div className="grid gap-8 lg:grid-cols-3">
                    <Card className="lg:col-span-1">
                        <CardHeader className="items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={student.photoURL || undefined} alt={student.name} />
                                <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
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
                    <Card className="lg:col-span-2">
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
                                    {quizHistory.length > 0 ? (
                                        quizHistory.map(item => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.quizTitle}</TableCell>
                                                <TableCell>{item.score}/{item.totalQuestions}</TableCell>
                                                <TableCell>{format(item.completedAt.toDate(), 'PPp')}</TableCell>
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

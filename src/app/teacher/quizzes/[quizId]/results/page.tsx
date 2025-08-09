
'use client';
import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock data for demonstration purposes
const quizResults = {
    "quiz-1": {
        title: "Algebra Basics",
        results: [
            { studentId: "usr-1", name: "Liam Johnson", avatar: "https://placehold.co/100x100.png", initials: "LJ", score: "8/10", date: "2024-07-28" },
            { studentId: "usr-2", name: "Olivia Smith", avatar: "https://placehold.co/100x100.png", initials: "OS", score: "10/10", date: "2024-07-28" },
            { studentId: "usr-4", name: "Emma Brown", avatar: "https://placehold.co/100x100.png", initials: "EB", score: "6/10", date: "2024-07-27" },
        ]
    },
    "quiz-2": {
        title: "The Roman Empire",
        results: [
            { studentId: "usr-1", name: "Liam Johnson", avatar: "https://placehold.co/100x100.png", initials: "LJ", score: "9/10", date: "2024-07-26" },
            { studentId: "usr-3", name: "Noah Williams", avatar: "https://placehold.co/100x100.png", initials: "NW", score: "7/10", date: "2024-07-26" },
            { studentId: "usr-5", name: "Oliver Jones", avatar: "https://placehold.co/100x100.png", initials: "OJ", score: "8/10", date: "2024-07-25" },
        ]
    },
    "quiz-3": {
        title: "Introduction to Psychology",
        results: []
    }
};

export default function QuizResultsPage() {
    const params = useParams();
    const quizId = params.quizId as keyof typeof quizResults;
    const data = quizResults[quizId];

    if (!data) {
        return (
            <AppLayout>
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Quiz not found</h1>
                    <p className="text-muted-foreground">The quiz you are looking for does not exist.</p>
                    <Link href="/teacher/quizzes">
                        <Button variant="outline" className="mt-4">
                            <ArrowLeft className="mr-2 h-4 w-4"/>
                            Back to Quizzes
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
                    <Link href="/teacher/quizzes" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        Back to Quizzes
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Results for "{data.title}"</h1>
                    <p className="text-muted-foreground">A summary of student performance on this quiz.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Student Submissions</CardTitle>
                        <CardDescription>
                            {data.results.length > 0
                                ? `Showing ${data.results.length} result(s).`
                                : "No students have completed this quiz yet."
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Student</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Date Completed</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.results.map(result => (
                                    <TableRow key={result.studentId}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={result.avatar} alt={result.name} data-ai-hint="person portrait" />
                                                    <AvatarFallback>{result.initials}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{result.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-semibold text-lg">{result.score}</TableCell>
                                        <TableCell className="text-muted-foreground">{result.date}</TableCell>
                                    </TableRow>
                                ))}
                                 {data.results.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">
                                            No results to display.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </div>
        </AppLayout>
    )
}

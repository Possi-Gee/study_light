import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Mail, User, Shield } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const quizHistory = [
  { quiz: "General Knowledge Quiz", score: "3/4", date: "2024-07-21" },
  { quiz: "Algebra Basics", score: "8/10", date: "2024-07-20" },
  { quiz: "Intro to Calculus", score: "5/10", date: "2024-07-18" },
  { quiz: "The Roman Empire", score: "9/10", date: "2024-07-15" },
];

export default function ProfilePage() {
    return (
        <AppLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                    <p className="text-muted-foreground">Manage your account information and view your progress.</p>
                </div>
                <div className="grid gap-8 md:grid-cols-3">
                    <Card className="md:col-span-1">
                        <CardHeader className="items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src="https://placehold.co/100x100.png" alt="@student" data-ai-hint="person portrait"/>
                                <AvatarFallback>SS</AvatarFallback>
                            </Avatar>
                            <CardTitle>Student</CardTitle>
                            <CardDescription>student@example.com</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center">
                                <User className="mr-2 h-4 w-4 text-muted-foreground"/>
                                <span>Name: Student</span>
                            </div>
                            <div className="flex items-center">
                                <Mail className="mr-2 h-4 w-4 text-muted-foreground"/>
                                <span>Email: student@example.com</span>
                            </div>
                             <div className="flex items-center">
                                <Shield className="mr-2 h-4 w-4 text-muted-foreground"/>
                                <span>Role: Student</span>
                            </div>
                            <Button variant="outline" className="w-full">Edit Profile</Button>
                            <Link href="/login" className="w-full">
                                <Button variant="destructive" className="w-full">
                                    <LogOut className="mr-2 h-4 w-4"/>
                                    Logout
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Quiz History</CardTitle>
                            <CardDescription>A summary of your recent quiz performance.</CardDescription>
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
                                    {quizHistory.map(item => (
                                        <TableRow key={item.quiz}>
                                            <TableCell className="font-medium">{item.quiz}</TableCell>
                                            <TableCell>{item.score}</TableCell>
                                            <TableCell>{item.date}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}

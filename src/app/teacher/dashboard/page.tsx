
'use client';
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { getSubjectsCount } from "@/services/notes-service";
import { getQuizzesCount } from "@/services/quizzes-service";
import { getStudentsCount } from "@/services/user-service";
import { BookMarked, RefreshCw, HelpCircle, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

type DashboardStats = {
    subjects: number;
    quizzes: number;
    students: number;
}

export default function TeacherDashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        try {
            const [subjectsCount, quizzesCount, studentsCount] = await Promise.all([
                getSubjectsCount(),
                getQuizzesCount(),
                getStudentsCount(),
            ]);
            setStats({
                subjects: subjectsCount,
                quizzes: quizzesCount,
                students: studentsCount,
            });
        } catch (error) {
            console.error("Failed to fetch dashboard stats:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleRefresh = () => {
        fetchStats();
    }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.displayName || 'Teacher'}!</h1>
                <p className="text-muted-foreground">Here's a summary of your teaching activity.</p>
            </div>
            <Button variant="outline" onClick={handleRefresh} disabled={loading} className="shrink-0">
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}/>
                Refresh Data
            </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardDescription>Manage Notes & Subjects</CardDescription>
                        <BookMarked className="w-5 h-5 text-muted-foreground" />
                    </div>
                     {loading ? <Skeleton className="h-10 w-1/2 mt-1"/> : <CardTitle className="text-4xl font-bold">{stats?.subjects} Subjects</CardTitle>}
                    <CardDescription>Create, edit, and assign notes to your subjects.</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                    <Link href="/teacher/notes" className="w-full">
                        <Button className="w-full">
                            Manage Notes
                        </Button>
                    </Link>
                </CardContent>
            </Card>
            <Card className="flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardDescription>Manage Quizzes</CardDescription>
                        <HelpCircle className="w-5 h-5 text-muted-foreground" />
                    </div>
                    {loading ? <Skeleton className="h-10 w-1/2 mt-1"/> : <CardTitle className="text-4xl font-bold">{stats?.quizzes} Quizzes</CardTitle>}
                    <CardDescription>Create new quizzes and view student results.</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                    <Link href="/teacher/quizzes" className="w-full">
                        <Button className="w-full">
                            Manage Quizzes
                        </Button>
                    </Link>
                </CardContent>
            </Card>
            <Card className="flex flex-col lg:col-span-1">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardDescription>Student Overview</CardDescription>
                        <Users className="w-5 h-5 text-muted-foreground" />
                    </div>
                     {loading ? <Skeleton className="h-10 w-1/2 mt-1"/> : <CardTitle className="text-4xl font-bold">{stats?.students} Students</CardTitle>}
                    <CardDescription>View student progress and quiz history.</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                    <Link href="/teacher/students" className="w-full">
                        <Button className="w-full">
                           View Students
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}

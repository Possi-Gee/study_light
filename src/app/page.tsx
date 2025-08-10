
'use client';

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { Quiz } from "@/lib/quiz-store";
import { getQuizzes } from "@/services/quizzes-service";
import { ArrowRight, BookOpen, CalendarCheck, Puzzle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RecentActivityList } from "@/components/recent-activity-list";

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentQuizzes, setRecentQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentQuizzes() {
        setLoading(true);
        try {
            const allQuizzes = await getQuizzes();
            // Assuming getQuizzes returns them sorted by createdAt descending
            setRecentQuizzes(allQuizzes.slice(0, 5));
        } catch (error) {
            console.error("Failed to fetch recent quizzes:", error);
        } finally {
            setLoading(false);
        }
    }
    fetchRecentQuizzes();
  }, []);

  const formattedQuizzes = recentQuizzes.map(q => ({
    id: q.id,
    title: q.title,
    subtitle: `A new quiz in ${q.subject}`,
    // @ts-ignore - Firestore timestamp vs Date
    timestamp: q.createdAt?.toDate() || new Date(),
    link: `/quizzes/${q.id}`
  }));

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.displayName || 'Student'}!</h1>
            <p className="text-muted-foreground">Ready to ace your exams? Here's what you can do.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarCheck className="text-primary"/>
                        AI Study Schedule
                    </CardTitle>
                    <CardDescription>Let our AI generate a personalized study plan to help you prepare for your exams efficiently.</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                    <Link href="/schedule" className="w-full">
                        <Button className="w-full">
                            Generate Schedule <ArrowRight className="ml-2"/>
                        </Button>
                    </Link>
                </CardContent>
            </Card>
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="text-primary"/>
                        Study Notes
                    </CardTitle>
                    <CardDescription>Access our comprehensive library of notes across all your subjects.</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                    <Link href="/notes" className="w-full">
                        <Button className="w-full">
                            Browse Notes <ArrowRight className="ml-2"/>
                        </Button>
                    </Link>
                </CardContent>
            </Card>
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Puzzle className="text-primary"/>
                        Practice Quizzes
                    </CardTitle>
                    <CardDescription>Test your knowledge and track your progress with our interactive quizzes.</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                    <Link href="/quizzes" className="w-full">
                        <Button className="w-full">
                            Take a Quiz <ArrowRight className="ml-2"/>
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
         <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>New Quizzes</CardTitle>
                <CardDescription>Check out the latest quizzes added by your teachers.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                     <div className="space-y-4">
                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                    </div>
                ) : (
                    <RecentActivityList 
                        items={formattedQuizzes} 
                        emptyStateText="No new quizzes have been added recently."
                    />
                )}
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

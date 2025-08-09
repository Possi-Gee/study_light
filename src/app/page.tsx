
'use client';

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, BookOpen, CalendarCheck, Puzzle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
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
      </div>
    </AppLayout>
  );
}

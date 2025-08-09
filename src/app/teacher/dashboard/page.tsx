
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookPlus, Users } from "lucide-react";
import Link from "next/link";

export default function TeacherDashboardPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, Teacher!</h1>
            <p className="text-muted-foreground">Here's your dashboard to manage students and content.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="text-primary"/>
                        Manage Students
                    </CardTitle>
                    <CardDescription>View student progress, and manage their accounts.</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                    <Link href="/teacher/students" className="w-full">
                        <Button className="w-full">
                            View Students <ArrowRight className="ml-2"/>
                        </Button>
                    </Link>
                </CardContent>
            </Card>
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookPlus className="text-primary"/>
                        Create Content
                    </CardTitle>
                    <CardDescription>Create and manage study notes and quizzes for your students.</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                    <Link href="/teacher/content" className="w-full">
                        <Button variant="secondary" className="w-full">
                            Manage Content <ArrowRight className="ml-2"/>
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}

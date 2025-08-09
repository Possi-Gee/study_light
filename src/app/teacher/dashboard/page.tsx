
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookMarked, PlusCircle, Presentation, RefreshCw, Users, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function TeacherDashboardPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome, Possi Gee!</h1>
            </div>
            <Button variant="outline">
                <RefreshCw className="mr-2"/>
                Refresh Data
            </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardDescription>Manage Notes & Subjects</CardDescription>
                        <PlusCircle className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-4xl font-bold">3 Subjects</CardTitle>
                    <CardDescription>Create, edit, and assign notes to your subjects.</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                    <Link href="#" className="w-full">
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
                    <CardTitle className="text-4xl font-bold">2 Quizzes</CardTitle>
                    <CardDescription>Create new quizzes and view student results.</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                    <Link href="#" className="w-full">
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
                    <CardTitle className="text-4xl font-bold">1 Students</CardTitle>
                    <CardDescription>View student progress and quiz history.</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                    <Link href="#" className="w-full">
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

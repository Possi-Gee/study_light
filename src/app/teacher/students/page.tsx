
'use client';
import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getInitials } from "@/lib/utils";
import { Eye } from "lucide-react";
import Link from "next/link";

const students = [
    {
        id: "usr-1",
        name: "Possi Gee",
        email: "possigee@96mail.com",
        avatar: "https://placehold.co/100x100.png",
        initials: "PG"
    },
    {
        id: "usr-2",
        name: "Olivia Smith",
        email: "olivia@example.com",
        avatar: "https://placehold.co/100x100.png",
        initials: "OS"
    },
    {
        id: "usr-3",
        name: "Noah Williams",
        email: "noah@example.com",
        avatar: "https://placehold.co/100x100.png",
        initials: "NW"
    },
    {
        id: "usr-4",
        name: "Emma Brown",
        email: "emma@example.com",
        avatar: "https://placehold.co/100x100.png",
        initials: "EB"
    },
    {
        id: "usr-5",
        name: "Oliver Jones",
        email: "oliver@example.com",
        avatar: "https://placehold.co/100x100.png",
        initials: "OJ"
    }
];


export default function TeacherStudentsPage() {
    return (
        <AppLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Students</h1>
                    <p className="text-muted-foreground">View and manage your students' progress and quiz history.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Enrolled Students</CardTitle>
                        <CardDescription>A list of all students currently enrolled in your courses.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Avatar</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.map(student => (
                                    <TableRow key={student.id}>
                                        <TableCell>
                                            <Avatar>
                                                <AvatarImage src={student.avatar} alt={student.name} />
                                                <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{student.email}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/teacher/students/${student.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="mr-2 h-4 w-4"/>
                                                    View Progress
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </div>
        </AppLayout>
    )
}

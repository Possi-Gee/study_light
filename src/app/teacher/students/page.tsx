
'use client';
import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { getInitials } from "@/lib/utils";
import { UserProfile, getStudents } from "@/services/user-service";
import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";


export default function TeacherStudentsPage() {
    const [students, setStudents] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedStudents = await getStudents();
            setStudents(fetchedStudents);
        } catch (error) {
            console.error("Failed to fetch students", error);
            toast({ variant: "destructive", title: "Error", description: "Could not fetch student data." });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);
    
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
                        <CardDescription>
                            {loading ? 'Loading student data...' : `A list of all ${students.length} student(s) currently enrolled in your courses.`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : (
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
                                {students.length > 0 ? students.map(student => (
                                    <TableRow key={student.uid}>
                                        <TableCell>
                                            <Avatar>
                                                <AvatarImage src={student.photoURL || undefined} alt={student.name} />
                                                <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{student.email}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/teacher/students/${student.uid}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="mr-2 h-4 w-4"/>
                                                    View Progress
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            No students have registered yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}

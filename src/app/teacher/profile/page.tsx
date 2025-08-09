
'use client';
import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { getInitials } from "@/lib/utils";
import { Edit, Mail, Shield, User } from "lucide-react";
import Link from "next/link";


export default function TeacherProfilePage() {
    const { user } = useAuth();
    
    return (
        <AppLayout>
            <div className="flex justify-center items-start pt-8">
                 <Card className="w-full max-w-md">
                    <CardHeader className="items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src={user?.photoURL || undefined} alt="@teacher"/>
                            <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{user?.displayName || 'Teacher'}</CardTitle>
                        <CardDescription>{user?.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex items-center">
                            <User className="mr-2 h-4 w-4 text-muted-foreground"/>
                            <span>Name: {user?.displayName || 'Teacher'}</span>
                        </div>
                        <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4 text-muted-foreground"/>
                            <span>Email: {user?.email}</span>
                        </div>
                        <div className="flex items-center">
                            <Shield className="mr-2 h-4 w-4 text-muted-foreground"/>
                            <span>Role: Teacher</span>
                        </div>
                         <Link href="/teacher/settings">
                            <Button variant="outline" className="w-full mt-2">
                                <Edit className="mr-2 h-4 w-4"/>
                                Edit Profile
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}

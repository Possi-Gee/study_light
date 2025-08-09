
'use client';
import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { LogOut, Mail, User, Shield, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const quizHistory = [
  { quiz: "General Knowledge Quiz", score: "3/4", date: "2024-07-21" },
  { quiz: "Algebra Basics", score: "8/10", date: "2024-07-20" },
  { quiz: "Intro to Calculus", score: "5/10", date: "2024-07-18" },
  { quiz: "The Roman Empire", score: "9/10", date: "2024-07-15" },
];

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || "https://placehold.co/100x100.png");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast({ title: "Logged out successfully." });
            router.push('/login');
        } catch (error) {
            toast({ variant: "destructive", title: "Logout failed." });
        }
    }
    
    const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result as string);
                // Here you would typically upload the file to a storage service (like Firebase Storage)
                // and update the user's profile URL in the database.
                toast({ title: "Profile picture updated locally." });
                setIsDialogOpen(false);
            };
            reader.readAsDataURL(file);
        }
    };

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
                                <AvatarImage src={avatarUrl} alt="@student" data-ai-hint="person portrait"/>
                                <AvatarFallback>{user?.displayName?.charAt(0) || 'S'}</AvatarFallback>
                            </Avatar>
                            <CardTitle>{user?.displayName || 'Student'}</CardTitle>
                            <CardDescription>{user?.email}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center">
                                <User className="mr-2 h-4 w-4 text-muted-foreground"/>
                                <span>Name: {user?.displayName || 'Student'}</span>
                            </div>
                            <div className="flex items-center">
                                <Mail className="mr-2 h-4 w-4 text-muted-foreground"/>
                                <span>Email: {user?.email}</span>
                            </div>
                             <div className="flex items-center">
                                <Shield className="mr-2 h-4 w-4 text-muted-foreground"/>
                                <span>Role: Student</span>
                            </div>
                             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full">Edit Profile</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit Profile</DialogTitle>
                                        <DialogDescription>Update your profile picture.</DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4 text-center">
                                        <Avatar className="h-32 w-32 mx-auto mb-4">
                                            <AvatarImage src={avatarUrl} alt="@student" data-ai-hint="person portrait"/>
                                            <AvatarFallback>{user?.displayName?.charAt(0) || 'S'}</AvatarFallback>
                                        </Avatar>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={handleAvatarUpload}
                                        />
                                        <Button onClick={() => fileInputRef.current?.click()}>
                                            <Upload className="mr-2 h-4 w-4"/>
                                            Upload Picture
                                        </Button>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Button variant="destructive" className="w-full" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4"/>
                                Logout
                            </Button>
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


'use client';
import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Mail, User, Shield, Upload, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { getSubmissionsForStudent, QuizSubmission } from "@/services/quizzes-service";
import { format } from "date-fns";
import { uploadAvatar, updateUserProfile } from "@/services/user-service";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/hooks/use-auth-store";
import { getInitials } from "@/lib/utils";

export default function ProfilePage() {
    const { user, isUpdating } = useAuthStore();
    const router = useRouter();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [quizHistory, setQuizHistory] = useState<QuizSubmission[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchHistory = async () => {
                try {
                    const submissions = await getSubmissionsForStudent(user.uid);
                    setQuizHistory(submissions);
                } catch (error) {
                    console.error("Failed to fetch quiz history", error);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Could not load your quiz history.",
                    });
                } finally {
                    setLoadingHistory(false);
                }
            };
            fetchHistory();
        }
    }, [user, toast]);


    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast({ title: "Logged out successfully." });
            router.push('/login');
        } catch (error) {
            toast({ variant: "destructive", title: "Logout failed." });
        }
    }
    
    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && user) {
            try {
                const photoURL = await uploadAvatar(user.uid, file);
                await updateUserProfile(user, { photoURL });
                toast({ title: "Success", description: "Profile picture updated!" });
                setIsDialogOpen(false); // Close dialog on success
            } catch (error) {
                console.error("Failed to upload avatar", error);
                toast({ variant: "destructive", title: "Upload Failed", description: "Could not upload your new picture." });
            }
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
                                <AvatarImage src={user?.photoURL || undefined} alt="@student"/>
                                <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
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
                                            <AvatarImage src={user?.photoURL || undefined} alt="@student"/>
                                            <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                                        </Avatar>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={handleAvatarUpload}
                                            disabled={isUpdating}
                                        />
                                        <Button onClick={() => fileInputRef.current?.click()} disabled={isUpdating}>
                                            {isUpdating ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                            ) : (
                                                <Upload className="mr-2 h-4 w-4"/>
                                            )}
                                            {isUpdating ? 'Uploading...' : 'Upload Picture'}
                                        </Button>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isUpdating}>Cancel</Button>
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
                            {loadingHistory ? (
                                <div className="flex justify-center items-center h-48">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Quiz</TableHead>
                                        <TableHead>Score</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {quizHistory.length > 0 ? (
                                        quizHistory.map(item => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.quizTitle}</TableCell>
                                                <TableCell>{item.score}/{item.totalQuestions}</TableCell>
                                                <TableCell>{format(item.completedAt.toDate(), 'PPp')}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-24 text-center">
                                                You haven't taken any quizzes yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}

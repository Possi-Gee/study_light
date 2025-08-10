
'use client';
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addAnnouncement, deleteAnnouncement, getAnnouncements, Announcement } from "@/services/announcements-service";
import { format } from "date-fns";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function TeacherAnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchAnnouncements = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedAnnouncements = await getAnnouncements();
            setAnnouncements(fetchedAnnouncements);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not fetch announcements." });
        } finally {
            setLoading(false);
        }
    }, [toast]);
    
    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const handleCreateAnnouncement = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsCreating(true);
        
        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        
        try {
            await addAnnouncement({ title, content });
            toast({ title: "Success", description: "Announcement posted." });
            fetchAnnouncements();
            setIsCreateDialogOpen(false);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            toast({ variant: "destructive", title: "Error", description: errorMessage });
        } finally {
            setIsCreating(false);
        }
    }
    
    const handleDeleteAnnouncement = async () => {
        if (!deletingId) return;
        
        try {
            await deleteAnnouncement(deletingId);
            toast({ title: "Success", description: "Announcement deleted." });
            fetchAnnouncements();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not delete announcement." });
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <AppLayout>
            <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
                <div className="space-y-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
                            <p className="text-muted-foreground">Post updates and news for all students.</p>
                        </div>
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <PlusCircle className="mr-2"/> New Announcement
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create Announcement</DialogTitle>
                                    <DialogDescription>
                                        This will be visible to all students immediately after posting.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input id="title" name="title" required disabled={isCreating} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="content">Content</Label>
                                        <Textarea id="content" name="content" required rows={5} disabled={isCreating} />
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="ghost" onClick={() => setIsCreateDialogOpen(false)} disabled={isCreating}>Cancel</Button>
                                        <Button type="submit" disabled={isCreating}>
                                            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                            Post
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Posted Announcements</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                             ) : announcements.length > 0 ? (
                                 announcements.map(announcement => (
                                    <div key={announcement.id} className="p-4 border rounded-md bg-muted/30 flex justify-between items-start gap-4">
                                        <div>
                                            <h4 className="font-semibold">{announcement.title}</h4>
                                            <p className="text-sm text-muted-foreground mt-1">{announcement.content}</p>
                                            <p className="text-xs text-muted-foreground/80 mt-2">
                                                Posted on {format(announcement.createdAt.toDate(), 'PPp')}
                                            </p>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-destructive hover:text-destructive shrink-0" 
                                            onClick={() => setDeletingId(announcement.id)}
                                        >
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                 ))
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                    <p className="text-muted-foreground">You haven't posted any announcements yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>
                 <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the announcement.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeletingId(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAnnouncement}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

    
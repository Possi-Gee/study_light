
'use client';
import { AppLayout } from "@/components/app-layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Note, Subject, getIconForSubject } from "@/lib/note-store";
import { addSubject, deleteSubject, addNote, updateNote, deleteNote, getSubjects } from "@/services/notes-service";
import { Eye, PlusCircle, Trash2, Edit, Loader2, BrainCircuit } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { GenerateNoteDialog } from "@/components/generate-note-dialog";
import Link from "next/link";
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

type DeletingNote = {
    subjectId: string;
    noteId: string;
} | null;


export default function TeacherNotesPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
    const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
    const [isAiNoteDialogOpen, setIsAiNoteDialogOpen] = useState(false);
    
    const [deletingNote, setDeletingNote] = useState<DeletingNote>(null);


    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);

    const fetchSubjects = useCallback(async () => {
        try {
            setLoading(true);
            const fetchedSubjects = await getSubjects();
            setSubjects(fetchedSubjects);
        } catch (error) {
            console.error("Failed to fetch subjects:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not fetch subjects." });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    const handleAddSubject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const subjectName = formData.get('subjectName') as string;
        if (subjectName) {
            try {
                await addSubject(subjectName);
                toast({ title: "Success", description: "Subject created." });
                fetchSubjects(); // Re-fetch
                setIsSubjectDialogOpen(false);
            } catch (error) {
                 toast({ variant: "destructive", title: "Error", description: "Could not create subject." });
            }
        }
    };
    
    const handleDeleteSubject = async (subjectId: string) => {
        if(confirm("Are you sure you want to delete this subject and all its notes? This cannot be undone.")){
            try {
                await deleteSubject(subjectId);
                toast({ title: "Success", description: "Subject deleted." });
                fetchSubjects(); // Re-fetch
            } catch (error) {
                toast({ variant: "destructive", title: "Error", description: "Could not delete subject." });
            }
        }
    }

    const openNoteDialog = (subjectId: string, note: Note | null = null) => {
        setActiveSubjectId(subjectId);
        setEditingNote(note);
        setIsNoteDialogOpen(true);
    }
    
    const openAiNoteDialog = (subjectId: string) => {
        setActiveSubjectId(subjectId);
        setIsAiNoteDialogOpen(true);
    }
    
    const handleSaveNote = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!activeSubjectId) return;

        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;

        try {
            if (editingNote) { // Editing existing note
                await updateNote(activeSubjectId, { ...editingNote, title, content });
                toast({ title: "Success", description: "Note updated." });
            } else { // Adding new note
                await addNote(activeSubjectId, { title, content });
                toast({ title: "Success", description: "Note created." });
            }
            fetchSubjects(); // Re-fetch
        } catch (error) {
             toast({ variant: "destructive", title: "Error", description: "Could not save note." });
        } finally {
            setIsNoteDialogOpen(false);
            setEditingNote(null);
            setActiveSubjectId(null);
        }
    }

    const handleDeleteNote = async () => {
        if (!deletingNote) return;
        
        try {
            await deleteNote(deletingNote.subjectId, deletingNote.noteId);
            toast({ title: "Success", description: "Note deleted." });
            fetchSubjects(); // Re-fetch
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not delete note." });
        } finally {
            setDeletingNote(null); // Close dialog
        }
    }
    
     const handleNoteGenerated = () => {
        fetchSubjects(); // Re-fetch subjects and notes
        toast({ title: "Success", description: "AI-generated note has been added." });
    }

    return (
        <AppLayout>
            <div className="space-y-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Manage Notes</h1>
                        <p className="text-muted-foreground">Create, edit, and organize study materials for your students.</p>
                    </div>
                    <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2"/> Add Subject
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add a New Subject</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddSubject}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="subjectName" className="text-right">Subject Name</Label>
                                        <Input id="subjectName" name="subjectName" className="col-span-3" placeholder="e.g., Advanced Physics" required/>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Create Subject</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardContent className="p-4 md:p-6">
                         {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                         ) : (
                        <Accordion type="multiple" className="w-full">
                            {subjects.map((subject) => {
                                const Icon = getIconForSubject(subject.iconName);
                                return (
                                <AccordionItem value={subject.id} key={subject.id}>
                                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                        <div className="flex items-center gap-3">
                                            <Icon className="h-6 w-6 text-primary" />
                                            {subject.name}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="pl-9 space-y-4">
                                            <div className="flex justify-between items-center">
                                                <p className="text-muted-foreground text-sm">{subject.notes.length} note(s) in this subject.</p>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => openNoteDialog(subject.id)}>
                                                        <PlusCircle className="mr-2 h-4 w-4"/> Add Note
                                                    </Button>
                                                    <GenerateNoteDialog
                                                        open={isAiNoteDialogOpen && activeSubjectId === subject.id}
                                                        onOpenChange={(isOpen) => {
                                                            if (!isOpen) setActiveSubjectId(null);
                                                            setIsAiNoteDialogOpen(isOpen);
                                                        }}
                                                        subjectId={subject.id}
                                                        onNoteGenerated={handleNoteGenerated}
                                                    >
                                                        <Button variant="outline" size="sm" onClick={() => openAiNoteDialog(subject.id)}>
                                                            <BrainCircuit className="mr-2 h-4 w-4"/> Generate Note
                                                        </Button>
                                                    </GenerateNoteDialog>
                                                     <Button variant="destructive" size="sm" onClick={() => handleDeleteSubject(subject.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4"/> Delete Subject
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                {subject.notes.map(note => (
                                                    <div key={note.id} className="p-3 rounded-md border bg-muted/30 flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-semibold">{note.title}</h4>
                                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{note.content}</p>
                                                        </div>
                                                        <div className="flex gap-2 shrink-0 ml-4">
                                                            <Link href={`/notes/${note.id}?subjectId=${subject.id}`} passHref>
                                                                <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                                                                    <Eye className="h-4 w-4"/>
                                                                </Button>
                                                            </Link>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openNoteDialog(subject.id, note)}>
                                                                <Edit className="h-4 w-4"/>
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeletingNote({ subjectId: subject.id, noteId: note.id })}>
                                                                <Trash2 className="h-4 w-4"/>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {subject.notes.length === 0 && (
                                                <p className="text-center text-muted-foreground py-4">No notes here yet. Add one!</p>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            )})}
                        </Accordion>
                        )}
                         {!loading && subjects.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">You haven't created any subjects yet.</p>
                                <Button className="mt-4" onClick={() => setIsSubjectDialogOpen(true)}><PlusCircle className="mr-2"/> Add Your First Subject</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Note Editor/Creator Dialog */}
            <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
                 <DialogContent className="sm:max-w-[625px] grid-rows-[auto_1fr_auto] p-0 max-h-[90vh]">
                    <DialogHeader className="p-6">
                        <DialogTitle>{editingNote ? 'Edit Note' : 'Add a New Note'}</DialogTitle>
                    </DialogHeader>
                     <form onSubmit={handleSaveNote} className="grid gap-4 py-4 overflow-y-auto px-6">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Title</Label>
                            <Input id="title" name="title" className="col-span-3" defaultValue={editingNote?.title} placeholder="Note title" required/>
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="content" className="text-right pt-2">Content</Label>
                            <Textarea id="content" name="content" className="col-span-3" defaultValue={editingNote?.content} placeholder="Note content..." required rows={12}/>
                        </div>
                         <DialogFooter className="p-6 bg-muted/50 border-t col-span-full">
                            <Button type="button" variant="ghost" onClick={() => setIsNoteDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">{editingNote ? 'Save Changes' : 'Create Note'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            
            {/* Delete Confirmation Dialog */}
             <AlertDialog open={!!deletingNote} onOpenChange={(open) => !open && setDeletingNote(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the note.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeletingNote(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteNote}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


        </AppLayout>
    );
}

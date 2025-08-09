
'use client';
import { AppLayout } from "@/components/app-layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNoteStore, Note, Subject } from "@/lib/note-store";
import { Eye, PlusCircle, Trash2, Edit } from "lucide-react";
import { useState } from "react";

export default function TeacherNotesPage() {
    const { subjects, addSubject, deleteSubject, addNote, updateNote, deleteNote } = useNoteStore();
    const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
    const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
    const [isViewNoteDialogOpen, setIsViewNoteDialogOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [viewingNote, setViewingNote] = useState<Note | null>(null);
    const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);

    const handleAddSubject = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const subjectName = formData.get('subjectName') as string;
        if (subjectName) {
            addSubject(subjectName);
            setIsSubjectDialogOpen(false);
        }
    };

    const openNoteDialog = (subjectId: string, note: Note | null = null) => {
        setActiveSubjectId(subjectId);
        setEditingNote(note);
        setIsNoteDialogOpen(true);
    }

    const openViewNoteDialog = (note: Note) => {
        setViewingNote(note);
        setIsViewNoteDialogOpen(true);
    }
    
    const handleSaveNote = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!activeSubjectId) return;

        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;

        if (editingNote) { // Editing existing note
            updateNote(activeSubjectId, { ...editingNote, title, content });
        } else { // Adding new note
            addNote(activeSubjectId, { title, content });
        }
        
        setIsNoteDialogOpen(false);
        setEditingNote(null);
        setActiveSubjectId(null);
    }

    const handleDeleteNoteFromDialog = (subjectId: string, noteId: string) => {
        deleteNote(subjectId, noteId);
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
                        <Accordion type="multiple" className="w-full">
                            {subjects.map((subject) => (
                                <AccordionItem value={subject.id} key={subject.id}>
                                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                        <div className="flex items-center gap-3">
                                            <subject.icon className="h-6 w-6 text-primary" />
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
                                                     <Button variant="destructive" size="sm" onClick={() => deleteSubject(subject.id)}>
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
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openViewNoteDialog(note)}>
                                                                <Eye className="h-4 w-4"/>
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openNoteDialog(subject.id, note)}>
                                                                <Edit className="h-4 w-4"/>
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteNoteFromDialog(subject.id, note.id)}>
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
                            ))}
                        </Accordion>
                         {subjects.length === 0 && (
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
                    </form>
                    <DialogFooter className="p-6 bg-muted/50 border-t">
                        <Button type="button" variant="ghost" onClick={() => setIsNoteDialogOpen(false)}>Cancel</Button>
                        <Button type="submit" onClick={(e) => {
                            // This is a bit of a hack to submit the form from outside
                             const form = e.currentTarget.closest('.grid-rows-[auto_1fr_auto]')?.querySelector('form');
                             if(form){
                                 form.requestSubmit();
                             }
                        }}>{editingNote ? 'Save Changes' : 'Create Note'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

             {/* View Note Dialog */}
            <Dialog open={isViewNoteDialogOpen} onOpenChange={setIsViewNoteDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{viewingNote?.title}</DialogTitle>
                        <DialogDescription>
                            Read the full content of the note below.
                        </DialogDescription>
                    </DialogHeader>
                     <div className="py-4 prose dark:prose-invert max-h-[60vh] overflow-y-auto">
                        <p>{viewingNote?.content}</p>
                     </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button>Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

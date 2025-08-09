
'use client';
import { AppLayout } from "@/components/app-layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookCopy, Brain, Eye, FlaskConical, Globe, PlusCircle, Trash2, Edit } from "lucide-react";
import { useState } from "react";

const initialSubjects = [
  {
    id: "subj-1",
    name: "Mathematics",
    icon: BookCopy,
    notes: [
      { id: "note-1", title: "Algebra Basics", content: "An overview of variables, equations, and functions. This includes linear equations, quadratic equations, and the fundamental theorem of algebra." },
      { id: "note-2", title: "Introduction to Calculus", content: "Understanding limits, derivatives, and integrals. We will explore the concepts of differentiation and integration and their applications in solving real-world problems." },
      { id: "note-3", title: "Geometry Fundamentals", content: "Exploring shapes, angles, and proofs. This module covers Euclidean geometry, including points, lines, planes, angles, triangles, and circles." },
    ],
  },
  {
    id: "subj-2",
    name: "Science",
    icon: FlaskConical,
    notes: [
      { id: "note-4", title: "The Cell", content: "The basic structural, functional, and biological unit of all known organisms. We will examine the structure of prokaryotic and eukaryotic cells." },
      { id: "note-5", title: "Newton's Laws of Motion", content: "Three physical laws that form the basis for classical mechanics. These laws describe the relationship between a body and the forces acting upon it, and its motion in response to those forces." },
      { id: "note-6", title: "Chemical Reactions", content: "A process that leads to the chemical transformation of one set of chemical substances to another. This includes synthesis, decomposition, single-replacement, and double-replacement reactions." },
    ],
  },
  {
    id: "subj-3",
    name: "History",
    icon: Globe,
    notes: [
        { id: "note-7", title: "The Roman Empire", content: "The post-Republican period of ancient Rome, characterized by a government headed by emperors and large territorial holdings around the Mediterranean Sea in Europe, Africa, and Asia." },
        { id: "note-8", title: "The Renaissance", content: "A period in European history marking the transition from the Middle Ages to modernity and covering the 15th and 16th centuries. It is associated with great social change and artistic production." },
    ],
  },
  {
      id: "subj-4",
      name: "Psychology",
      icon: Brain,
      notes: [
          { id: "note-9", title: "Introduction to Psychology", content: "The scientific study of mind and behavior. Psychology is a multifaceted discipline and includes many sub-fields of study such areas as human development, sports, health, clinical, social behavior and cognitive processes." },
          { id: "note-10", title: "Cognitive Psychology", content: "The study of mental processes such as attention, language use, memory, perception, problem solving, creativity, and thinking." },
      ]
  }
];

type Note = {
    id: string;
    title: string;
    content: string;
};

type Subject = {
    id: string;
    name: string;
    icon: React.ElementType;
    notes: Note[];
};


export default function TeacherNotesPage() {
    const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
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
            const newSubject: Subject = {
                id: `subj-${Date.now()}`,
                name: subjectName,
                icon: BookCopy, // Default icon
                notes: []
            };
            setSubjects([...subjects, newSubject]);
            setIsSubjectDialogOpen(false);
        }
    };

    const handleDeleteSubject = (subjectId: string) => {
        setSubjects(subjects.filter(s => s.id !== subjectId));
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
            const updatedSubjects = subjects.map(s => {
                if (s.id === activeSubjectId) {
                    return {
                        ...s,
                        notes: s.notes.map(n => n.id === editingNote.id ? { ...n, title, content } : n)
                    };
                }
                return s;
            });
            setSubjects(updatedSubjects);
        } else { // Adding new note
            const newNote: Note = {
                id: `note-${Date.now()}`,
                title,
                content
            };
            const updatedSubjects = subjects.map(s => {
                if (s.id === activeSubjectId) {
                    return { ...s, notes: [...s.notes, newNote] };
                }
                return s;
            });
            setSubjects(updatedSubjects);
        }
        
        setIsNoteDialogOpen(false);
        setEditingNote(null);
        setActiveSubjectId(null);
    }

    const handleDeleteNote = (subjectId: string, noteId: string) => {
         const updatedSubjects = subjects.map(s => {
            if (s.id === subjectId) {
                return { ...s, notes: s.notes.filter(n => n.id !== noteId) };
            }
            return s;
        });
        setSubjects(updatedSubjects);
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
                                                     <Button variant="destructive" size="sm" onClick={() => handleDeleteSubject(subject.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4"/> Delete Subject
                                                    </Button>
                                                </div>
                                            </div>
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
                                                         <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteNote(subject.id, note.id)}>
                                                            <Trash2 className="h-4 w-4"/>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingNote ? 'Edit Note' : 'Add a New Note'}</DialogTitle>
                    </DialogHeader>
                     <form onSubmit={handleSaveNote}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Title</Label>
                                <Input id="title" name="title" className="col-span-3" defaultValue={editingNote?.title} placeholder="Note title" required/>
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="content" className="text-right pt-2">Content</Label>
                                <Textarea id="content" name="content" className="col-span-3" defaultValue={editingNote?.content} placeholder="Note content..." required rows={8}/>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">{editingNote ? 'Save Changes' : 'Create Note'}</Button>
                        </DialogFooter>
                    </form>
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

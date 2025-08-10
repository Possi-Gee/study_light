
'use client';
import { AppLayout } from "@/components/app-layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { getIconForSubject, Subject } from "@/lib/note-store";
import { getSubjects } from "@/services/notes-service";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function NotesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const fetchedSubjects = await getSubjects();
        setSubjects(fetchedSubjects);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSubjects();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Study Notes</h1>
          <p className="text-muted-foreground">Browse notes by subject. Expand a subject to see the topics.</p>
        </div>
        <Card>
            <CardContent className="p-4 md:p-6">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                <Accordion type="single" collapsible className="w-full">
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
                                    <div className="pl-9 space-y-2">
                                    {subject.notes.map(note => (
                                        <Link href={`/notes/${note.id}?subjectId=${subject.id}`} key={note.id} className="block p-3 rounded-md border bg-muted/50 hover:bg-muted/80 transition-colors">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-semibold">{note.title}</h4>
                                                <ArrowRight className="h-4 w-4 text-muted-foreground"/>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{note.content}</p>
                                        </Link>
                                    ))}
                                    {subject.notes.length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-4">No notes available for this subject yet.</p>
                                    )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
                )}
                {!loading && subjects.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No study notes are available at the moment.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

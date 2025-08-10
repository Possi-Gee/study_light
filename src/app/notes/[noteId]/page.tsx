
'use client';

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Note } from "@/lib/note-store";
import { getNoteById } from "@/services/notes-service";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// A simple component to parse and render the note content
const NoteContent = ({ content }: { content: string }) => {
    const paragraphs = content.split('\n').filter(p => p.trim() !== '');
    return (
        <div className="prose prose-lg dark:prose-invert max-w-none">
            {paragraphs.map((p, i) => {
                 // Use a regex to find and replace **text** with <strong>text</strong>
                 const highlightedText = p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                
                // Remove the leading '*' if it exists for list-like items
                const cleanText = highlightedText.replace(/^\*\s*/, '');

                return <p key={i} dangerouslySetInnerHTML={{ __html: cleanText }} />;
            })}
        </div>
    );
};


export default function NoteViewerPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const noteId = params.noteId as string;
    const subjectId = searchParams.get('subjectId');

    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (noteId && subjectId) {
            const fetchNote = async () => {
                setLoading(true);
                try {
                    const fetchedNote = await getNoteById(subjectId, noteId);
                    setNote(fetchedNote);
                } catch (error) {
                    console.error("Failed to fetch note:", error);
                    setNote(null);
                } finally {
                    setLoading(false);
                }
            };
            fetchNote();
        } else if (!subjectId) {
            console.error("Subject ID is missing from URL");
            setLoading(false);
        }
    }, [noteId, subjectId]);

    return (
        <AppLayout>
             <div>
                <Link href="/notes" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Back to All Notes
                </Link>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : note ? (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-4xl font-extrabold tracking-tight lg:text-5xl">{note.title}</CardTitle>
                            <CardDescription>Read through the study material below.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <NoteContent content={note.content} />
                        </CardContent>
                    </Card>
                ) : (
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">Note not found</h1>
                        <p className="text-muted-foreground">This note may have been removed or the link is incomplete.</p>
                         <Link href="/notes">
                            <Button variant="outline" className="mt-4">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to All Notes
                            </Button>
                        </Link>
                    </div>
                )}

            </div>
        </AppLayout>
    );
}

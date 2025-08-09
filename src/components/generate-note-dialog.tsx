
'use client';

import { generateNoteContent } from "@/ai/flows/generate-note-content";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { addNote } from "@/services/notes-service";
import { BrainCircuit, Loader2 } from "lucide-react";
import { useState, type ReactNode } from "react";

type GenerateNoteDialogProps = {
    children: ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    subjectId: string;
    onNoteGenerated: () => void;
}

export function GenerateNoteDialog({ children, open, onOpenChange, subjectId, onNoteGenerated }: GenerateNoteDialogProps) {
    const { toast } = useToast();
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if(!topic) {
            toast({ variant: "destructive", title: "Topic is required" });
            return;
        }
        setIsLoading(true);
        try {
            const result = await generateNoteContent({ topic });

            if(result.title && result.content) {
                // Save the generated note to Firestore
                await addNote(subjectId, {
                    title: result.title,
                    content: result.content,
                });
                
                onNoteGenerated();
                onOpenChange(false); // Close dialog on success
                // Reset form
                setTopic('');
            } else {
                 toast({ variant: "destructive", title: "AI Error", description: "The AI failed to generate note content. Please try again." });
            }

        } catch (error) {
            console.error("Failed to generate or save note:", error);
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
            toast({ variant: "destructive", title: "Error", description: errorMessage });
        } finally {
            setIsLoading(false);
        }
    }


    return (
         <Dialog open={open} onOpenChange={(isOpen) => {
             if (!isLoading) {
                 onOpenChange(isOpen);
                 if (!isOpen) setTopic(''); // Reset topic when closing
             }
         }}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><BrainCircuit/> Generate Note with AI</DialogTitle>
                    <DialogDescription>
                        Provide a topic and let the AI write the study note for you.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="topic">Topic</Label>
                        <Input 
                            id="topic" 
                            value={topic} 
                            onChange={e => setTopic(e.target.value)} 
                            placeholder="e.g. The Causes of World War I" 
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleGenerate} disabled={isLoading || !topic}>
                         {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        {isLoading ? "Generating..." : "Generate Note"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

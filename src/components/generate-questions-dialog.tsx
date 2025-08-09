
'use client';

import { generateQuizQuestions } from "@/ai/flows/generate-quiz-questions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { QuizQuestion } from "@/lib/quiz-store";
import { BrainCircuit, Loader2 } from "lucide-react";
import { useState, type ReactNode } from "react";

type GenerateQuestionsDialogProps = {
    children: ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onQuestionsGenerated: (questions: QuizQuestion[]) => void;
}

export function GenerateQuestionsDialog({ children, open, onOpenChange, onQuestionsGenerated }: GenerateQuestionsDialogProps) {
    const { toast } = useToast();
    const [topic, setTopic] = useState('');
    const [notes, setNotes] = useState('');
    const [numQuestions, setNumQuestions] = useState(5);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if(!topic) {
            toast({ variant: "destructive", title: "Topic is required" });
            return;
        }
        setIsLoading(true);
        try {
            const result = await generateQuizQuestions({
                topic,
                notes,
                numQuestions
            });

            if(result.questions && result.questions.length > 0) {
                onQuestionsGenerated(result.questions);
                onOpenChange(false); // Close dialog on success
                // Reset form
                setTopic('');
                setNotes('');
                setNumQuestions(5);
            } else {
                 toast({ variant: "destructive", title: "AI Error", description: "The AI failed to generate questions. Please try again." });
            }

        } catch (error) {
            console.error("Failed to generate questions", error);
            toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
        } finally {
            setIsLoading(false);
        }
    }


    return (
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><BrainCircuit/> Generate Questions with AI</DialogTitle>
                    <DialogDescription>
                        Provide a topic and optional notes to automatically generate quiz questions.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="topic">Topic</Label>
                        <Input id="topic" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. The American Revolution" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Context/Notes (Optional)</Label>
                        <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Paste any relevant notes or text here..." rows={6} />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="numQuestions">Number of Questions: {numQuestions}</Label>
                        <Slider 
                            id="numQuestions"
                            min={1} 
                            max={10} 
                            step={1} 
                            value={[numQuestions]} 
                            onValueChange={(value) => setNumQuestions(value[0])}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleGenerate} disabled={isLoading || !topic}>
                         {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        {isLoading ? "Generating..." : "Generate"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


import { AppLayout } from "@/components/app-layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { BookCopy, Brain, FlaskConical, Globe } from "lucide-react";

const subjects = [
  {
    name: "Mathematics",
    icon: BookCopy,
    notes: [
      { title: "Algebra Basics", content: "An overview of variables, equations, and functions." },
      { title: "Introduction to Calculus", content: "Understanding limits, derivatives, and integrals." },
      { title: "Geometry Fundamentals", content: "Exploring shapes, angles, and proofs." },
    ],
  },
  {
    name: "Science",
    icon: FlaskConical,
    notes: [
      { title: "The Cell", content: "The basic structural, functional, and biological unit of all known organisms." },
      { title: "Newton's Laws of Motion", content: "Three physical laws that form the basis for classical mechanics." },
      { title: "Chemical Reactions", content: "A process that leads to the chemical transformation of one set of chemical substances to another." },
    ],
  },
  {
    name: "History",
    icon: Globe,
    notes: [
        { title: "The Roman Empire", content: "The post-Republican period of ancient Rome." },
        { title: "The Renaissance", content: "A period in European history marking the transition from the Middle Ages to modernity." },
    ],
  },
  {
      name: "Psychology",
      icon: Brain,
      notes: [
          { title: "Introduction to Psychology", content: "The scientific study of mind and behavior." },
          { title: "Cognitive Psychology", content: "The study of mental processes such as attention, language use, memory, perception, problem solving, creativity, and thinking." },
      ]
  }
];

export default function NotesPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Study Notes</h1>
          <p className="text-muted-foreground">Browse notes by subject. Expand a subject to see the topics.</p>
        </div>
        <Card>
            <CardContent className="p-4 md:p-6">
                <Accordion type="single" collapsible className="w-full">
                    {subjects.map((subject, index) => (
                        <AccordionItem value={`item-${index}`} key={subject.name}>
                            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                <div className="flex items-center gap-3">
                                    <subject.icon className="h-6 w-6 text-primary" />
                                    {subject.name}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="pl-9 space-y-2">
                                {subject.notes.map(note => (
                                    <div key={note.title} className="p-3 rounded-md border bg-muted/50">
                                        <h4 className="font-semibold">{note.title}</h4>
                                        <p className="text-sm text-muted-foreground">{note.content}</p>
                                    </div>
                                ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

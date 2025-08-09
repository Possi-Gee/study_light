
'use client';
import { create } from 'zustand';
import { BookCopy, Brain, FlaskConical, Globe } from "lucide-react";

export type Note = {
    id: string;
    title: string;
    content: string;
};

export type Subject = {
    id: string;
    name: string;
    icon: React.ElementType;
    notes: Note[];
};

const initialSubjects: Subject[] = [
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


interface NoteStore {
    subjects: Subject[];
    addSubject: (subjectName: string) => void;
    deleteSubject: (subjectId: string) => void;
    addNote: (subjectId: string, note: Omit<Note, 'id'>) => void;
    updateNote: (subjectId: string, note: Note) => void;
    deleteNote: (subjectId: string, noteId: string) => void;
}

export const useNoteStore = create<NoteStore>((set) => ({
    subjects: initialSubjects,
    addSubject: (subjectName) => {
        const newSubject: Subject = {
            id: `subj-${Date.now()}`,
            name: subjectName,
            icon: BookCopy, // Default icon
            notes: []
        };
        set(state => ({ subjects: [...state.subjects, newSubject] }));
    },
    deleteSubject: (subjectId) => {
        set(state => ({ subjects: state.subjects.filter(s => s.id !== subjectId) }));
    },
    addNote: (subjectId, noteData) => {
        const newNote: Note = { ...noteData, id: `note-${Date.now()}` };
        set(state => ({
            subjects: state.subjects.map(s => {
                if (s.id === subjectId) {
                    return { ...s, notes: [...s.notes, newNote] };
                }
                return s;
            })
        }));
    },
    updateNote: (subjectId, noteData) => {
         set(state => ({
            subjects: state.subjects.map(s => {
                if (s.id === subjectId) {
                    return {
                        ...s,
                        notes: s.notes.map(n => n.id === noteData.id ? noteData : n)
                    };
                }
                return s;
            })
        }));
    },
    deleteNote: (subjectId, noteId) => {
        set(state => ({
            subjects: state.subjects.map(s => {
                if (s.id === subjectId) {
                    return { ...s, notes: s.notes.filter(n => n.id !== noteId) };
                }
                return s;
            })
        }));
    }
}));

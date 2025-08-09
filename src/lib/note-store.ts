
'use client';
import { BookCopy, Brain, FlaskConical, Globe, LucideIcon } from "lucide-react";

// This file is being kept for type definitions, but the state management is now handled by Firestore.

export type Note = {
    id: string;
    title: string;
    content: string;
};

export type Subject = {
    id: string;
    name: string;
    iconName: string; // Store icon name instead of component
    notes: Note[];
};

export const subjectIcons: { [key: string]: LucideIcon } = {
    BookCopy: BookCopy,
    FlaskConical: FlaskConical,
    Globe: Globe,
    Brain: Brain,
};

export const getIconForSubject = (iconName: string): LucideIcon => {
    return subjectIcons[iconName] || BookCopy;
}

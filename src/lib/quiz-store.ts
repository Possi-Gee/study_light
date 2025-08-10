
'use client';

// In a real application, this data would be fetched from a database.
// We use a Zustand store to simulate a persistent data source for the prototype.

export type QuizQuestion = {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
};

export type Quiz = {
    id: string;
    title: string;
    subject: string;
    questions: QuizQuestion[];
    timer?: number; // Duration in minutes
};

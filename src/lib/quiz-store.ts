
'use client';
import { create } from 'zustand';

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
};

const initialQuizzes: Quiz[] = [
    {
        id: "quiz-1",
        title: "Algebra Basics",
        subject: "Mathematics",
        questions: [
            { id: "q-1", text: "Solve for x: 2x + 3 = 11", options: ["3", "4", "5", "6"], correctAnswer: "4" },
            { id: "q-2", text: "What is (x+y)^2?", options: ["x^2 + y^2", "x^2 + 2xy + y^2", "x^2 - 2xy + y^2", "2x + 2y"], correctAnswer: "x^2 + 2xy + y^2" },
        ]
    },
    {
        id: "quiz-2",
        title: "The Roman Empire",
        subject: "History",
        questions: [
            { id: "q-3", text: "Who was the first Roman Emperor?", options: ["Julius Caesar", "Nero", "Augustus", "Constantine"], correctAnswer: "Augustus" },
            { id: "q-4", text: "When did the Western Roman Empire fall?", options: ["476 AD", "1453 AD", "44 BC", "753 BC"], correctAnswer: "476 AD" }
        ]
    },
    {
        id: "quiz-3",
        title: "Introduction to Psychology",
        subject: "Psychology",
        questions: []
    }
];

export const subjects = [ "Mathematics", "Science", "History", "Psychology" ];

interface QuizStore {
    quizzes: Quiz[];
    getQuizById: (id: string) => Quiz | undefined;
    addQuiz: (quiz: Omit<Quiz, 'id'>) => void;
    updateQuiz: (id: string, quiz: Partial<Quiz>) => void;
    deleteQuiz: (id: string) => void;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
    quizzes: initialQuizzes,
    getQuizById: (id) => get().quizzes.find(q => q.id === id),
    addQuiz: (quiz) => {
        const newQuiz = { ...quiz, id: `quiz-${Date.now()}` };
        set(state => ({ quizzes: [...state.quizzes, newQuiz] }));
    },
    updateQuiz: (id, quizData) => {
        set(state => ({
            quizzes: state.quizzes.map(q => q.id === id ? { ...q, ...quizData } : q)
        }));
    },
    deleteQuiz: (id) => {
        set(state => ({ quizzes: state.quizzes.filter(q => q.id !== id) }));
    }
}));

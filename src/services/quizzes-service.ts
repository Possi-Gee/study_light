
import { db } from "@/lib/firebase";
import { Quiz, QuizQuestion } from "@/lib/quiz-store";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    orderBy,
    query
} from "firebase/firestore";

const quizzesCollection = collection(db, 'quizzes');

export async function getQuizzes(): Promise<Quiz[]> {
    const q = query(quizzesCollection, orderBy("createdAt", "desc"));
    const quizSnapshot = await getDocs(q);
    return quizSnapshot.docs.map(doc => ({
        ...(doc.data() as Omit<Quiz, 'id'>),
        id: doc.id
    }));
}

export async function getQuizById(id: string): Promise<Quiz | null> {
    const quizDoc = doc(db, 'quizzes', id);
    const quizSnapshot = await getDoc(quizDoc);
    if (quizSnapshot.exists()) {
        return {
            ...(quizSnapshot.data() as Omit<Quiz, 'id'>),
            id: quizSnapshot.id
        };
    }
    return null;
}

export async function addQuiz(quizData: Omit<Quiz, 'id'>): Promise<string> {
    const newQuizRef = await addDoc(quizzesCollection, {
        ...quizData,
        createdAt: serverTimestamp()
    });
    return newQuizRef.id;
}

export async function updateQuiz(id: string, quizData: Partial<Omit<Quiz, 'id'>>): Promise<void> {
    const quizDoc = doc(db, 'quizzes', id);
    await updateDoc(quizDoc, quizData);
}

export async function deleteQuiz(id: string): Promise<void> {
    const quizDoc = doc(db, 'quizzes', id);
    await deleteDoc(quizDoc);
}

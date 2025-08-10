

import { db } from "@/lib/firebase";
import { Note, Subject } from "@/lib/note-store";
import { 
    collection, 
    getDocs, 
    doc, 
    addDoc, 
    deleteDoc, 
    writeBatch,
    updateDoc,
    query,
    getDoc,
} from "firebase/firestore";


// === Subject Operations ===

export async function getSubjects(): Promise<Subject[]> {
    const subjectsCollection = collection(db, 'subjects');
    const subjectSnapshot = await getDocs(subjectsCollection);
    const subjects = await Promise.all(subjectSnapshot.docs.map(async (doc) => {
        const subjectData = doc.data() as Omit<Subject, 'id' | 'notes'>;
        const notes = await getNotesForSubject(doc.id);
        return { 
            ...subjectData, 
            id: doc.id,
            notes: notes
        };
    }));
    return subjects;
}

export async function addSubject(subjectName: string): Promise<Subject> {
    const subjectsCollection = collection(db, 'subjects');
    const newSubjectRef = await addDoc(subjectsCollection, { 
        name: subjectName,
        iconName: 'BookCopy' // Default icon
    });
    return { id: newSubjectRef.id, name: subjectName, iconName: 'BookCopy', notes: [] };
}

export async function deleteSubject(subjectId: string): Promise<void> {
    const batch = writeBatch(db);

    // Delete all notes within the subject
    const notesCollection = collection(db, `subjects/${subjectId}/notes`);
    const notesSnapshot = await getDocs(notesCollection);
    notesSnapshot.forEach(doc => {
        batch.delete(doc.ref);
    });

    // Delete the subject itself
    const subjectDoc = doc(db, 'subjects', subjectId);
    batch.delete(subjectDoc);

    await batch.commit();
}


// === Note Operations ===

export async function getNotesForSubject(subjectId: string): Promise<Note[]> {
    const notesCollection = collection(db, `subjects/${subjectId}/notes`);
    const noteSnapshot = await getDocs(notesCollection);
    const notes = noteSnapshot.docs.map(doc => ({
        ...(doc.data() as Omit<Note, 'id'>),
        id: doc.id
    }));
    return notes;
}

export async function getNoteById(subjectId: string, noteId: string): Promise<Note | null> {
    if (!subjectId || !noteId) return null;
    const noteDocRef = doc(db, `subjects/${subjectId}/notes`, noteId);
    const docSnap = await getDoc(noteDocRef);

    if (docSnap.exists()) {
        return {
            ...(docSnap.data() as Omit<Note, 'id'>),
            id: docSnap.id,
        };
    }
    
    console.error(`Note not found: subjectId=${subjectId}, noteId=${noteId}`);
    return null;
}


export async function addNote(subjectId: string, noteData: Omit<Note, 'id'>): Promise<Note> {
    const notesCollection = collection(db, `subjects/${subjectId}/notes`);
    const newNoteRef = await addDoc(notesCollection, noteData);
    return { ...noteData, id: newNoteRef.id };
}

export async function updateNote(subjectId: string, noteData: Note): Promise<void> {
    const noteDoc = doc(db, `subjects/${subjectId}/notes`, noteData.id);
    await updateDoc(noteDoc, {
        title: noteData.title,
        content: noteData.content,
    });
}

export async function deleteNote(subjectId: string, noteId: string): Promise<void> {
    const noteDoc = doc(db, `subjects/${subjectId}/notes`, noteId);
    await deleteDoc(noteDoc);
}

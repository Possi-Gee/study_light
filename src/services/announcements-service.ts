
'use server';

import { db, auth } from "@/lib/firebase";
import {
    collection,
    getDocs,
    doc,
    addDoc,
    deleteDoc,
    serverTimestamp,
    orderBy,
    query,
    Timestamp,
} from "firebase/firestore";

export type Announcement = {
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: Timestamp;
};

const announcementsCollection = collection(db, 'announcements');

export async function getAnnouncements(): Promise<Announcement[]> {
    const q = query(announcementsCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        ...(doc.data() as Omit<Announcement, 'id'>),
        id: doc.id
    }));
}

type AddAnnouncementData = {
    title: string;
    content: string;
}

export async function addAnnouncement(data: AddAnnouncementData): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User not authenticated");
    }

    const newAnnouncementRef = await addDoc(announcementsCollection, {
        ...data,
        authorId: user.uid,
        authorName: user.displayName || 'Teacher',
        createdAt: serverTimestamp()
    });
    return newAnnouncementRef.id;
}


export async function deleteAnnouncement(id: string): Promise<void> {
    const announcementDoc = doc(db, 'announcements', id);
    await deleteDoc(announcementDoc);
}

    
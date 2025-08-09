

import { auth, db, storage } from "@/lib/firebase";
import { useAuthStore } from "@/hooks/use-auth-store";
import { User, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc, collection, getDocs, query, where } from "firebase/firestore";

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  photoURL: string | null;
}

export async function addUser(userData: UserProfile): Promise<void> {
    const userRef = doc(db, "users", userData.uid);
    await setDoc(userRef, userData);
}

export async function getUserById(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
    }
    return null;
}

export async function getStudents(): Promise<UserProfile[]> {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "==", "student"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as UserProfile);
}


export async function uploadAvatarAndUpdateProfile(file: File) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  useAuthStore.getState().setUpdating(true);
  
  try {
    // 1. Upload the file to Firebase Storage
    const storageRef = ref(storage, `avatars/${currentUser.uid}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(snapshot.ref);

    // 2. Update the user's profile with the new photoURL
    await updateProfile(currentUser, { photoURL });
    
    // 3. Force a reload of the user from Firebase to get the latest data
    await currentUser.reload();
    
    // 4. Set the latest user object in our store to trigger UI updates
    // This is important to make sure the UI reflects the change immediately
    const refreshedUser = auth.currentUser;
    if (refreshedUser) {
        useAuthStore.getState().setUser(refreshedUser);
    }

  } catch (error) {
    console.error("Error uploading avatar and updating profile:", error);
    // Re-throw the error so the component can catch it and show a toast
    throw error;
  } finally {
    // 5. ALWAYS ensure the updating state is reset
    useAuthStore.getState().setUpdating(false);
  }
}

export async function updateUserProfile(
  updates: { displayName?: string }
) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  useAuthStore.getState().setUpdating(true);

  try {
    await updateProfile(currentUser, updates);
    await currentUser.reload();
     const refreshedUser = auth.currentUser;
    if (refreshedUser) {
        useAuthStore.getState().setUser(refreshedUser);
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  } finally {
    useAuthStore.getState().setUpdating(false);
  }
}

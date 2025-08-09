
import { auth, storage } from "@/lib/firebase";
import { useAuthStore } from "@/hooks/use-auth-store";
import { User, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function updateUserProfile(
  user: User,
  updates: { displayName?: string; photoURL?: string }
) {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  await updateProfile(auth.currentUser, updates);
  
  // After updating, we need to get the fresh user object from Firebase
  // as the one we have might be stale.
  await auth.currentUser.reload();
  
  // Now set the latest user object in our store, which will trigger UI updates
  useAuthStore.getState().setUser(auth.currentUser);
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const storageRef = ref(storage, `avatars/${userId}/${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}


import { auth, storage } from "@/lib/firebase";
import { useAuthStore } from "@/hooks/use-auth-store";
import { User, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function updateUserProfile(
  user: User,
  updates: { displayName?: string; photoURL?: string }
) {
  await updateProfile(user, updates);
  // After updating, refresh the user state in our store
  useAuthStore.getState().setUser(auth.currentUser);
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const storageRef = ref(storage, `avatars/${userId}/${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

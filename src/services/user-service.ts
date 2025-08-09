
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

  // Set updating state to true at the beginning of the operation
  useAuthStore.getState().setUpdating(true);

  try {
    // Perform the profile update in Firebase Auth
    await updateProfile(auth.currentUser, updates);
    
    // After updating, we need to get the fresh user object from Firebase
    // as the one we have might be stale. This is crucial.
    await auth.currentUser.reload();
    
    // Now set the latest user object in our store, which will trigger UI updates
    // across the application.
    useAuthStore.getState().setUser(auth.currentUser);

  } catch (error) {
    // Re-throw the error to be caught by the calling component for UI feedback
    throw error;
  } finally {
     // Set updating state to false once everything is done, even if there was an error.
    useAuthStore.getState().setUpdating(false);
  }
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
   // This function is now only responsible for uploading and returning the URL.
   // The loading state is handled by the caller, updateUserProfile.
   const storageRef = ref(storage, `avatars/${userId}/${file.name}`);
   await uploadBytes(storageRef, file);
   const downloadURL = await getDownloadURL(storageRef);
   return downloadURL;
}


import { auth, storage } from "@/lib/firebase";
import { useAuthStore } from "@/hooks/use-auth-store";
import { User, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function updateUserProfile(
  // The user parameter is not used to prevent using a stale object.
  // We rely on auth.currentUser directly.
  user: User, 
  updates: { displayName?: string; photoURL?: string }
) {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  useAuthStore.getState().setUpdating(true);

  try {
    await updateProfile(auth.currentUser, updates);
    
    // Force a reload of the user from Firebase to get the latest data.
    // This is the crucial step that was missing.
    await auth.currentUser.reload();
    
    // Now, auth.currentUser is guaranteed to be fresh.
    // Set the latest user object in our store to trigger UI updates.
    useAuthStore.getState().setUser(auth.currentUser);

  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  } finally {
    useAuthStore.getState().setUpdating(false);
  }
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
   const storageRef = ref(storage, `avatars/${userId}/${file.name}`);
   useAuthStore.getState().setUpdating(true);
   try {
     await uploadBytes(storageRef, file);
     const downloadURL = await getDownloadURL(storageRef);
     return downloadURL;
   } catch(error) {
    console.error("Error uploading avatar:", error);
    throw error;
   } finally {
    // The updating state will be set to false in the calling updateUserProfile function
   }
}

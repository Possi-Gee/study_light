
import { auth, storage } from "@/lib/firebase";
import { useAuthStore } from "@/hooks/use-auth-store";
import { User, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadAvatarAndUpdateProfile(file: File) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  useAuthStore.getState().setUpdating(true);
  
  try {
    // 1. Upload the file to Firebase Storage
    const storageRef = ref(storage, `avatars/${currentUser.uid}/${file.name}`);
    await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(storageRef);

    // 2. Update the user's profile with the new photoURL
    await updateProfile(currentUser, { photoURL });
    
    // 3. Force a reload of the user from Firebase to get the latest data
    await currentUser.reload();
    
    // 4. Set the latest user object in our store to trigger UI updates
    useAuthStore.getState().setUser(auth.currentUser);

  } catch (error) {
    console.error("Error uploading avatar and updating profile:", error);
    throw error;
  } finally {
    useAuthStore.getState().setUpdating(false);
  }
}

export async function updateUserProfile(
  updates: { displayName?: string }
) {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  useAuthStore.getState().setUpdating(true);

  try {
    await updateProfile(auth.currentUser, updates);
    await auth.currentUser.reload();
    useAuthStore.getState().setUser(auth.currentUser);

  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  } finally {
    useAuthStore.getState().setUpdating(false);
  }
}

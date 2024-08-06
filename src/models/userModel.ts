import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

// Define the structure of the user data
export interface UserData {
  name: string;
  email: string;
  profilePictureUrl: string;
  status: string;
}

// Create or update user data
export const createUser = async (userId: string, userData: UserData) => {
  try {
    await setDoc(doc(db, "users", userId), userData);
    console.log("User created/updated successfully");
  } catch (error) {
    console.error("Error creating/updating user:", error);
  }
};

// Retrieve user data
export const getUser = async (userId: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    } else {
      console.log("No such user!");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    return null;
  }
};

// Update user data
export const updateUser = async (
  userId: string,
  updatedData: Partial<UserData>
) => {
  try {
    await updateDoc(doc(db, "users", userId), updatedData);
    console.log("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

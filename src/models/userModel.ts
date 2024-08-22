import { User as FirebaseUser } from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export interface UserData {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  lastSeen: Timestamp;
  uid: string ;
}

export async function createUser(
  userData: UserData
): Promise<void> {
  try {
    const userRef = doc(db, "users", userData.uid);
    await setDoc(userRef, userData);
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

export async function fetchUser(uid: string ): Promise<UserData | null> {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
}

export async function updateUser(
  uid: string,
  data: Partial<UserData>
): Promise<void> {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...data,
      lastSeen: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
}

export async function updateUserLastSeen(uid: string): Promise<void> {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      lastSeen: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user last seen:", error);
    throw new Error("Failed to update user last seen");
  }
}

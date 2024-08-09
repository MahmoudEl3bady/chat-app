import { User as FirebaseUser } from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export interface UserData {
  displayName: string | null;
  email: string | null;
  photoURL: string|null;
  lastSeen: Date;
  uid: string | null;
}

export class User {
  private uid: string;
  private data: UserData | null;

  constructor(user: FirebaseUser) {
    this.uid = user.uid;
    this.data = null;
  }

  async create(userData:UserData): Promise<void> {
    const userRef = doc(db, "users", this.uid);
   
    await setDoc(userRef, userData);
  }

  async fetch(): Promise<UserData | null> {
    const userRef = doc(db, "users", this.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      this.data = userSnap.data() as UserData;
      return this.data;
    }
    return null;
  }

  async update(data: Partial<UserData>): Promise<void> {
    const userRef = doc(db, "users", this.uid);
    await updateDoc(userRef, {
      ...data,
      lastSeen: serverTimestamp(),
    });
    if (this.data) {
      this.data = { ...this.data, ...data };
    }
  }

  async updateLastSeen(): Promise<void> {
    const userRef = doc(db, "users", this.uid);
    await updateDoc(userRef, {
      lastSeen: serverTimestamp(),
    });
    if (this.data) {
      this.data.lastSeen = new Date();
    }
  }

  getData(): UserData | null {
    return this.data;
  }

  getUid(): string {
    return this.uid;
  }
}

export default User;

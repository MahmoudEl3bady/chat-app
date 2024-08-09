// models/Chat.ts

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  Timestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

export interface ChatData {
  id?: string;
  participants: string[];
  createdAt: Timestamp;
  lastMessage: string;
  lastMessageTimestamp: Timestamp;
}

export async function createChat(participants: string[]): Promise<string> {
  const chatRef = doc(collection(db, "chats"));
  const chatData: ChatData = {
    participants,
    createdAt: Timestamp.now(),
    lastMessage: "",
    lastMessageTimestamp: Timestamp.now(),
  };
  await setDoc(chatRef, chatData);
  return chatRef.id;
}

export async function fetchChat(id: string): Promise<ChatData | null> {
  const chatRef = doc(db, "chats", id);
  const chatSnap = await getDoc(chatRef);
  if (chatSnap.exists()) {
    return chatSnap.data() as ChatData;
  }
  return null;
}

export async function updateChatLastMessage(
  id: string,
  message: string
): Promise<void> {
  if (!id) throw new Error("Chat ID is not set");
  const chatRef = doc(db, "chats", id);
  await updateDoc(chatRef, {
    lastMessage: message,
    lastMessageTimestamp: Timestamp.now(),
  });
}

export const getChatsByUser = async (userId: string): Promise<ChatData[]> =>{
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("participants", "array-contains", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as ChatData);
}


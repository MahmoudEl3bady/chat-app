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
  onSnapshot,
  writeBatch,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export interface ChatData {
  chatId: string;
  participants: string[];
  createdAt: Timestamp;
  lastMessage: string;
  lastMessageTimestamp: Timestamp;
}

export async function createChat(participants: string[]): Promise<string> {
  const chatRef = doc(collection(db, "chats"));
  const chatData: ChatData = {
    chatId: chatRef.id,
    participants,
    createdAt: serverTimestamp() as Timestamp,
    lastMessage: "",
    lastMessageTimestamp: serverTimestamp() as Timestamp,
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

export const getChatsByUser = (userId: string | undefined): any => {
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("participants", "array-contains", userId));
  return onSnapshot(q, (querySnapshot) => {
    return querySnapshot.docs.map((doc) => doc.data()) as ChatData[];
  });
}



export const deleteChat = async (chatId: string) => {
  const chatRef = doc(db, "chats", chatId);

  // Delete all messages in the chat
  const messagesRef = collection(chatRef, "messages");
  const messagesSnapshot = await getDocs(messagesRef);
  const batch = writeBatch(db);

  messagesSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  // Delete the chat document
  await deleteDoc(chatRef);
}
// models/Message.ts

import {
  addDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  where,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export interface MessageData {
  senderId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

export async function sendMessage(
  chatId: string,
  senderId: string,
  content: string
): Promise<string> {
  const messageData: MessageData = {
    senderId,
    content,
    createdAt: new Date(),
    read: false,
  };

  // Add the message to the messages subcollection
  const messageRef = await addDoc(
    collection(db, "chats", chatId, "messages"),
    messageData
  );

  // Update the chat document with the last message info
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    lastMessage: content,
    lastMessageTimestamp: serverTimestamp(),
  });

  return messageRef.id;
}


export async function getRecentMessages(
  chatId: string,
  limitNum = 50,
): Promise<MessageData[]> {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("timestamp", "desc"), limit(limitNum));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as MessageData);
}

export async function getUnreadMessages(
  chatId: string,
  userId: string
): Promise<MessageData[]> {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(
    messagesRef,
    where("read", "==", false),
    where("senderId", "!=", userId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as MessageData);
}




export const fetchUnreadMessageCount = async (chatId: string, userId: string) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(
    messagesRef,
    where("read", "==", false),
    where("senderId", "!=", userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.size;
};
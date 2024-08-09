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
} from "firebase/firestore";
import { db } from "../firebase";

interface MessageData {
  senderId: string;
  content: string;
  timestamp: Timestamp;
  read: boolean;
}

export async function createMessage(
  chatId: string,
  senderId: string,
  content: string
): Promise<string> {
  const messageData: MessageData = {
    senderId,
    content,
    timestamp: Timestamp.now(),
    read: false,
  };
  const docRef = await addDoc(
    collection(db, "chats", chatId, "messages"),
    messageData
  );
  return docRef.id;
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


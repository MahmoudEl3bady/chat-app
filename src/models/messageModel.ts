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

class Message {
  private id: string | null;
  private data: MessageData | null;

  constructor(id: string | null = null, data: MessageData | null = null) {
    this.id = id;
    this.data = data;
  }

  async create(
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
    this.id = docRef.id;
    this.data = messageData;
    return this.id;
  }

  static async getRecentMessages(
    chatId: string,
    limitNum = 50,
  ): Promise<Message[]> {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "desc"), limit(limitNum));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => new Message(doc.id, doc.data() as MessageData)
    );
  }

  static async getUnreadMessages(
    chatId: string,
    userId: string
  ): Promise<Message[]> {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(
      messagesRef,
      where("read", "==", false),
      where("senderId", "!=", userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => new Message(doc.id, doc.data() as MessageData)
    );
  }

  getId(): string | null {
    return this.id;
  }

  getData(): MessageData | null {
    return this.data;
  }
}

export default Message;

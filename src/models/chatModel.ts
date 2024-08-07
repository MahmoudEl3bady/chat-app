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

interface ChatData {
  participants: string[];
  createdAt: Timestamp;
  lastMessage: string;
  lastMessageTimestamp: Timestamp;
}

class Chat {
  private id: string | null;
  private data: ChatData | null;

  constructor(id: string | null = null) {
    this.id = id;
    this.data = null;
  }

  async create(participants: string[]): Promise<string> {
    const chatRef = doc(collection(db, "chats"));
    const chatData: ChatData = {
      participants,
      createdAt: Timestamp.now(),
      lastMessage: "",
      lastMessageTimestamp: Timestamp.now(),
    };
    await setDoc(chatRef, chatData);
    this.id = chatRef.id;
    this.data = chatData;
    return this.id;
  }

  async fetch(): Promise<ChatData | null> {
    if (!this.id) return null;
    const chatRef = doc(db, "chats", this.id);
    const chatSnap = await getDoc(chatRef);
    if (chatSnap.exists()) {
      this.data = chatSnap.data() as ChatData;
      return this.data;
    }
    return null;
  }

  async updateLastMessage(message: string): Promise<void> {
    if (!this.id) throw new Error("Chat ID is not set");
    const chatRef = doc(db, "chats", this.id);
    await updateDoc(chatRef, {
      lastMessage: message,
      lastMessageTimestamp: Timestamp.now(),
    });
    if (this.data) {
      this.data.lastMessage = message;
      this.data.lastMessageTimestamp = Timestamp.now();
    }
  }

  static async getChatsByUser(userId: string): Promise<Chat[]> {
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("participants", "array-contains", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const chat = new Chat(doc.id);
      chat.data = doc.data() as ChatData;
      return chat;
    });
  }

  getId(): string | null {
    return this.id;
  }

  getData(): ChatData | null {
    return this.data;
  }
}

export default Chat;

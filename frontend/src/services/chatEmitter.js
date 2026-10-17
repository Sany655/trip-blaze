import { db, isFirebaseConfigured } from "../firebase.config";
import { collection, onSnapshot } from "firebase/firestore";

class ChatEmitter {
  constructor() {
    this.events = {};
    this.registeredUsers = {};

    // Cross-tab real-time sync via localStorage event
    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (e.key === "trip_blaze_db_messages") {
          this.emit("receive_message");
        }
      });
    }

    // Live sync via Firestore if configured
    if (isFirebaseConfigured() && db) {
      try {
        const messagesCol = collection(db, "messages");
        onSnapshot(messagesCol, () => {
          this.emit("receive_message");
        });
      } catch (err) {
        console.warn("Firestore messages onSnapshot listener notice:", err);
      }
    }
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return () => this.off(event, listener);
  }

  off(event, listenerToRemove) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(
      (listener) => listener !== listenerToRemove
    );
  }

  emit(event, ...args) {
    if (event === "register") {
      const userId = args[0];
      this.registeredUsers[userId] = true;
      return;
    }
    if (this.events[event]) {
      this.events[event].forEach((listener) => {
        try {
          listener(...args);
        } catch (err) {
          console.error(`Error in event listener for ${event}:`, err);
        }
      });
    }
  }
}

export const chatEmitter = new ChatEmitter();
export default chatEmitter;

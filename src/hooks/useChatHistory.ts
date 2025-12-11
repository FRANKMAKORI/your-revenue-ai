import { useState, useEffect, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = "yourrevenueai_chat_history";
const MAX_SESSIONS = 50;

export const useChatHistory = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const sessionsWithDates = parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          updatedAt: new Date(s.updatedAt),
          messages: s.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })),
        }));
        setSessions(sessionsWithDates);
      } catch (e) {
        console.error("Failed to parse chat history:", e);
      }
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  const createNewSession = useCallback((): string => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      title: "New Conversation",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setSessions((prev) => {
      const updated = [newSession, ...prev].slice(0, MAX_SESSIONS);
      return updated;
    });
    
    setCurrentSessionId(newSession.id);
    return newSession.id;
  }, []);

  const updateSession = useCallback((sessionId: string, messages: Message[]) => {
    setSessions((prev) => {
      return prev.map((session) => {
        if (session.id === sessionId) {
          // Generate title from first user message if not set
          let title = session.title;
          if (title === "New Conversation" && messages.length > 0) {
            const firstUserMsg = messages.find((m) => m.role === "user");
            if (firstUserMsg) {
              title = firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? "..." : "");
            }
          }
          return {
            ...session,
            title,
            messages,
            updatedAt: new Date(),
          };
        }
        return session;
      });
    });
  }, []);

  const loadSession = useCallback((sessionId: string): Message[] | null => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      return session.messages;
    }
    return null;
  }, [sessions]);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  }, [currentSessionId]);

  const clearAllHistory = useCallback(() => {
    setSessions([]);
    setCurrentSessionId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getCurrentSession = useCallback((): ChatSession | null => {
    if (!currentSessionId) return null;
    return sessions.find((s) => s.id === currentSessionId) || null;
  }, [currentSessionId, sessions]);

  return {
    sessions,
    currentSessionId,
    createNewSession,
    updateSession,
    loadSession,
    deleteSession,
    clearAllHistory,
    getCurrentSession,
    setCurrentSessionId,
  };
};

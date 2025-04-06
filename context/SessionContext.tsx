import React, { createContext, useContext, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { Session, ModelParameters, ChatMessage } from "@/types";

interface SessionContextProps {
  currentSession: Session | null;
  sessions: Session[];
  initializeSession: (
    phase: string,
    task: string,
    scope: string,
    language: string,
    model: string,
    skillLevel: number,
    languageExperience: number,
    aiToolsFamiliarity: number,
    userProvidedApiKey?: boolean
  ) => void;
  updateParameters: (parameters: ModelParameters) => void;
  addMessage: (
    role: "user" | "assistant" | "system",
    content: string,
    messageId?: string
  ) => string;
  updateMessage: (messageId: string, content: string) => void;
  removeMessage: (messageId: string) => void;
  completeSession: (
    qualityOfHelp: number,
    thingsLearned: number,
    feelingNow: number,
    feelingFuture: number,
    threatFelt: number,
    timeAllocated: number,
    timeSaved: number,
    notes: string
  ) => void;
  clearCurrentSession: () => void;
}

const defaultParameters: ModelParameters = {
  temperature: 0.7,
  maxTokens: 1000,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
};

// Store the current session in sessionStorage to preserve it during navigation
const getStoredSession = (): Session | null => {
  const storedSession = typeof window !== "undefined" ? sessionStorage.getItem("currentSession") : null;
  return storedSession ? JSON.parse(storedSession) : null;
};

const SessionContext = createContext<SessionContextProps | undefined>(
  undefined
);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentSession, setCurrentSession] = useState<Session | null>(() =>
    getStoredSession()
  );
  const [sessions, setSessions] = useState<Session[]>([]);

  // Update sessionStorage whenever currentSession changes
  React.useEffect(() => {
    if (currentSession) {
      sessionStorage.setItem("currentSession", JSON.stringify(currentSession));
    } else {
      sessionStorage.removeItem("currentSession");
    }
  }, [currentSession]);

  // Initialize a new session
  const initializeSession = (
    phase: string,
    task: string,
    scope: string,
    language: string,
    model: string,
    skillLevel: number,
    languageExperience: number,
    aiToolsFamiliarity: number,
    userProvidedApiKey?: boolean
  ) => {
    const newSession: Session = {
      id: uuidv4(),
      createdAt: new Date(),
      phase,
      task,
      scope,
      language,
      model,
      ratings: {
        preSession: {
          skillLevel,
          languageExperience,
          aiToolsFamiliarity,
        },
        postSession: {
          qualityOfHelp: 0,
          thingsLearned: 0,
          feelingNow: 0,
          feelingFuture: 0,
          threatFelt: 0,
          timeAllocated: 0,
          timeSaved: 0,
          notes: "",
        },
      },
      parameters: { ...defaultParameters },
      messages: [],
      userProvidedApiKey: userProvidedApiKey,
    };

    setCurrentSession(newSession);
  };

  // Update model parameters
  const updateParameters = (parameters: ModelParameters) => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        parameters,
      });
    }
  };

  // Add a message to the chat - returns the message ID
  const addMessage = (
    role: "user" | "assistant" | "system",
    content: string,
    messageId?: string
  ): string => {
    if (!currentSession) {
      console.error("Tried to add message but no current session exists");
      return "";
    }

    const id = messageId || uuidv4();

    // Check if message with same ID already exists (prevent duplicates)
    const existingMessageIndex = currentSession.messages.findIndex(
      (m) => m.id === id
    );
    if (existingMessageIndex !== -1) {
      console.log(
        `Message with ID ${id} already exists, updating instead of adding`
      );
      updateMessage(id, content);
      return id;
    }

    // Check for duplicated content from the same role (prevent accidental duplicates)
    const lastMessage =
      currentSession.messages.length > 0
        ? currentSession.messages[currentSession.messages.length - 1]
        : null;

    if (
      lastMessage &&
      lastMessage.role === role &&
      lastMessage.content === content
    ) {
      console.log(`Duplicate message content detected, not adding duplicate`);
      return lastMessage.id;
    }

    const newMessage: ChatMessage = {
      id,
      role,
      content,
      timestamp: new Date(),
      edited: false,
    };

    // Create a new messages array and update the session state
    setCurrentSession((prevSession) => {
      if (!prevSession) return null;

      const updatedMessages = [...prevSession.messages, newMessage];

      return {
        ...prevSession,
        messages: updatedMessages,
      };
    });

    console.log(`Added ${role} message with ID: ${id}`);
    return id;
  };

  // Update an existing message
  const updateMessage = (messageId: string, content: string) => {
    if (!currentSession) {
      console.error("Tried to update message but no current session exists");
      return;
    }

    setCurrentSession((prevSession) => {
      if (!prevSession) return null;

      // Find the message and update it
      const updatedMessages = prevSession.messages.map((message) => {
        if (message.id === messageId) {
          console.log(
            `Updating message ${messageId} with content: ${content.substring(
              0,
              50
            )}...`
          );
          return {
            ...message,
            content,
            edited: message.content !== "" && message.content !== content, // Only mark as edited if there was previous content
          };
        }
        return message;
      });

      // Return updated session with the new messages array
      return {
        ...prevSession,
        messages: updatedMessages,
      };
    });
  };

  // Remove a message from the chat
  const removeMessage = (messageId: string) => {
    if (!currentSession) {
      console.error("Tried to remove message but no current session exists");
      return;
    }

    setCurrentSession((prevSession) => {
      if (!prevSession) return null;

      // Filter out the message with the given ID
      const updatedMessages = prevSession.messages.filter(
        (message) => message.id !== messageId
      );

      return {
        ...prevSession,
        messages: updatedMessages,
      };
    });

    console.log(`Removed message with ID: ${messageId}`);
  };

  // Complete the session with post-session ratings
  const completeSession = (
    qualityOfHelp: number,
    thingsLearned: number,
    feelingNow: number,
    feelingFuture: number,
    threatFelt: number,
    timeAllocated: number,
    timeSaved: number,
    notes: string
  ) => {
    if (currentSession) {
      const completedSession: Session = {
        ...currentSession,
        ratings: {
          ...currentSession.ratings,
          postSession: {
            qualityOfHelp,
            thingsLearned,
            feelingNow,
            feelingFuture,
            threatFelt,
            timeAllocated,
            timeSaved,
            notes,
          },
        },
      };

      setSessions([completedSession, ...sessions]);
    }
  };

  // Clear the current session
  const clearCurrentSession = () => {
    setCurrentSession(null);
    sessionStorage.removeItem("currentSession");
  };

  return (
    <SessionContext.Provider
      value={{
        currentSession,
        sessions,
        initializeSession,
        updateParameters,
        addMessage,
        updateMessage,
        removeMessage, // Export the removeMessage function
        completeSession,
        clearCurrentSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

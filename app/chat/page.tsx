"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChat, type Message } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "@/context/SessionContext";
import ChatMessageComponent from "@/components/ChatMessage";
import ParameterSlider from "@/components/ParameterSlider";
import {
  CheckCircle,
  ChevronLeft,
  Settings,
  SendHorizonal,
  Loader2,
  KeyIcon,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/transitions";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "@/types";
import { getModelEndpoint } from "@/config/modelConfig";
import { v4 as uuidv4 } from "uuid";
import { useSession as useNextAuthSession, signOut, signIn } from 'next-auth/react';
import ProtectedRoute from "@/components/ProtectedRoute";
import ThemeToggle from '@/components/ThemeToggle';

const Chat = () => {
  const router = useRouter();
  const { toast } = useToast();
  const {
    currentSession,
    updateParameters,
    addMessage,
    updateMessage,
    removeMessage,
  } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [parameters, setParameters] = useState(
    currentSession?.parameters || {
      temperature: 0.7,
      maxTokens: 1000,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
    }
  );
  const [showNavigationDialog, setShowNavigationDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );

  const modelEndpoint = currentSession
    ? getModelEndpoint(currentSession.model)
    : null;

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    stop,
    reload,
    status,
    error
  } = useChat({
    api: modelEndpoint?.endpointRoute || "/api/chat",
    experimental_throttle: 50, // throttle the API requests
    body: {
      parameters,
      model: currentSession?.model,
      apiKey: currentSession?.userProvidedApiKey,
    },
    onFinish: (message) => {
      const chatMessage: ChatMessage = {
        id: message.id,
        role: "assistant",
        content: message.content,
        timestamp: new Date(),
        edited: false,
      };
      addMessage("assistant", message.content, message.id);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (!currentSession) {
      router.push("/");
    }
  }, [currentSession]);

  // Convert AI SDK messages to your ChatMessage type
  const convertedMessages: ChatMessage[] = messages.map((msg) => ({
    id: msg.id,
    role: msg.role as "user" | "assistant",
    content: msg.content,
    timestamp: new Date(msg.createdAt || Date.now()),
    edited:
      currentSession?.messages.find((m) => m.id === msg.id)?.edited || false,
  }));

  useEffect(() => {
    if (!currentSession) return;

    // Convert AI messages to session format
    const sessionFormatMessages = messages.map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      content: msg.content,
      timestamp: new Date(msg.createdAt || Date.now()),
      edited:
        currentSession.messages.find((m) => m.id === msg.id)?.edited || false,
    }));

    // Calculate differences between current session and AI messages
    const newMessages = sessionFormatMessages.filter(
      (aiMsg) =>
        !currentSession.messages.some(
          (sessionMsg) => sessionMsg.id === aiMsg.id
        )
    );

    const updatedMessages = sessionFormatMessages.filter((aiMsg) => {
      const sessionMsg = currentSession.messages.find((m) => m.id === aiMsg.id);
      return sessionMsg && sessionMsg.content !== aiMsg.content;
    });

    // Update session with new messages
    newMessages.forEach((msg) => {
      addMessage(msg.role, msg.content, msg.id);
    });

    // Update changed messages
    updatedMessages.forEach((msg) => {
      updateMessage(msg.id, msg.content);
    });
  }, [messages]); // Trigger when AI messages change

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUpdateParameters = (newParameters: typeof parameters) => {
    setParameters(newParameters);
    updateParameters(newParameters);
  };

  const handleConfirmNavigation = () => {
    setShowNavigationDialog(false);
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
  };

  const handleNavigation = (path: string) => {
    if ((currentSession?.messages?.length ?? 0) > 0) {
      setPendingNavigation(path);
      setShowNavigationDialog(true);
    } else {
      router.push(path);
    }
  };

  const handleCancelNavigation = () => {
    setShowNavigationDialog(false);
    window.history.pushState(null, "", window.location.pathname);
  };

  // Handle message editing
  const handleEditUserMessage = (messageId: string, newContent: string) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    // Update both AI messages and session
    const updatedMessages = messages
      .slice(0, messageIndex + 1)
      .map((m) => (m.id === messageId ? { ...m, content: newContent } : m));

    setMessages(updatedMessages);
    updateMessage(messageId, newContent);

    // Remove subsequent messages from session
    currentSession?.messages
      .filter((msg) => updatedMessages.findIndex((m) => m.id === msg.id) === -1)
      .forEach((msg) => {
        removeMessage(msg.id);
      });

    if (messages[messageIndex + 1]?.role === "assistant") {
      reload({
        body: {
          messages: updatedMessages,
          parameters,
          model: currentSession?.model,
          apiKey: currentSession?.userProvidedApiKey,
        },
      });
    }
  };

  // Handle response refresh (regenerate last response)
  const handleRefreshLastResponse = () => {
    const lastUserMessageIndex = convertedMessages.findLastIndex(
      (m) => m.role === "user"
    );

    if (lastUserMessageIndex === -1) return;

    // Remove all messages after the last user message
    const messagesUpToUser = messages.slice(0, lastUserMessageIndex + 1);

    // Update both AI messages and session
    setMessages(messagesUpToUser);

    // Clear subsequent session messages
    currentSession?.messages
      .filter(
        (msg) => messagesUpToUser.findIndex((m) => m.id === msg.id) === -1
      )
      .forEach((msg) => {
        // You'll need to add a removeMessage function to your session context
        removeMessage(msg.id); // Add this to your SessionContextProps
      });

    reload({
      body: {
        messages: messagesUpToUser,
        parameters,
        model: currentSession?.model,
        apiKey: currentSession?.userProvidedApiKey,
      },
    });
  };

  const handleEndSession = () => {
    router.push("/evaluate");
  };

  // Update isLastUserMessage to use converted messages
  const isLastUserMessage = (message: ChatMessage, index: number) => {
    for (let i = convertedMessages.length - 1; i >= 0; i--) {
      if (convertedMessages[i].role === "user") {
        return convertedMessages[i].id === message.id;
      }
    }
    return false;
  };

  // Check if message is last AI response
  const isLastAiMessage = (index: number) => {
    return (
      index === convertedMessages.length - 1 &&
      convertedMessages[index].role === "assistant"
    );
  };

  if (!currentSession) return null;

  return (
    <ProtectedRoute>
    <motion.div
      {...fadeIn}
      className="flex h-screen w-full bg-background overflow-hidden"
    >
      <AlertDialog
        open={showNavigationDialog}
        onOpenChange={setShowNavigationDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Chat?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave this chat? Your current
              conversation will be lost if you haven't ended the session
              properly.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelNavigation}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmNavigation}>
              Leave Chat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="w-full flex flex-col">
        <div className="bg-card shadow-sm border-b px-4 py-3 flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigation("/")}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-medium">{currentSession.task}</h1>
              <p className="text-xs text-muted-foreground">
                {currentSession.phase} • {currentSession.scope} •{" "}
                {currentSession.language}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Model Parameters</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Model Parameters</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <div className="space-y-6 mt-2">
                    <ParameterSlider
                      name="Temperature"
                      value={parameters.temperature}
                      onChange={(value) =>
                        handleUpdateParameters({
                          ...parameters,
                          temperature: value,
                        })
                      }
                      min={0}
                      max={2}
                      step={0.1}
                      description="Controls randomness: lower values are more deterministic, higher values are more creative."
                    />

                    <ParameterSlider
                      name="Max Tokens"
                      value={parameters.maxTokens}
                      onChange={(value) =>
                        handleUpdateParameters({
                          ...parameters,
                          maxTokens: value,
                        })
                      }
                      min={100}
                      max={4000}
                      step={100}
                      description="Maximum number of tokens to generate in the response."
                    />

                    <ParameterSlider
                      name="Top P"
                      value={parameters.topP}
                      onChange={(value) =>
                        handleUpdateParameters({ ...parameters, topP: value })
                      }
                      min={0}
                      max={1}
                      step={0.1}
                      description="Controls diversity via nucleus sampling."
                    />

                    <ParameterSlider
                      name="Frequency Penalty"
                      value={parameters.frequencyPenalty}
                      onChange={(value) =>
                        handleUpdateParameters({
                          ...parameters,
                          frequencyPenalty: value,
                        })
                      }
                      min={0}
                      max={2}
                      step={0.1}
                      description="Reduces repetition of frequent tokens."
                    />

                    <ParameterSlider
                      name="Presence Penalty"
                      value={parameters.presencePenalty}
                      onChange={(value) =>
                        handleUpdateParameters({
                          ...parameters,
                          presencePenalty: value,
                        })
                      }
                      min={0}
                      max={2}
                      step={0.1}
                      description="Reduces repetition of any already-used tokens."
                    />
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Current Model</h3>
                    <div className="bg-secondary/50 p-3 rounded-md">
                      <div className="font-medium">{currentSession.model}</div>
                      {modelEndpoint && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          Provider: {modelEndpoint.provider}
                        </div>
                      )}
                      {currentSession.userProvidedApiKey && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                          <KeyIcon className="h-3 w-3" />
                          <span>Using your provided API key</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Button onClick={handleEndSession}>
              <CheckCircle className="h-4 w-4 mr-2" />
              End Session
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 max-w-4xl mx-auto">
            {convertedMessages.length === 0 ? (
              <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center p-4">
                <div className="bg-secondary/50 p-6 rounded-lg max-w-md mx-auto">
                  <h3 className="text-xl font-medium mb-2">
                    Start your conversation
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Send a message to begin chatting with the{" "}
                    {currentSession.model} model.
                  </p>
                  {currentSession.userProvidedApiKey && (
                    <div className="flex items-center justify-center gap-1 mb-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-md">
                      <KeyIcon className="h-4 w-4" />
                      <span>Using your provided API key</span>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    You can adjust model parameters using the settings button in
                    the top right.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {convertedMessages.map((message, index) => (
                  <ChatMessageComponent
                    modelName={currentSession.model}
                    key={message.id}
                    message={message}
                    isLastMessage={index === convertedMessages.length - 1}
                    isLastUserMessage={isLastUserMessage(message, index)}
                    isLastAiMessage={isLastAiMessage(index)}
                    onEditMessage={
                      message.role === "user"
                        ? handleEditUserMessage
                        : undefined
                    }
                    onRefreshMessage={
                      isLastAiMessage(index)
                        ? handleRefreshLastResponse
                        : undefined
                    }
                    isRefreshing={
                      status === "streaming" && isLastAiMessage(index)
                    }
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-card w-full">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const userMessageId = uuidv4();
                addMessage("user", input, userMessageId);
                handleSubmit(e, {
                  body: {
                    messages: [
                      ...messages,
                      {
                        id: userMessageId,
                        role: "user",
                        content: input,
                        createdAt: new Date().toISOString(),
                      },
                    ],
                  },
                });
              }}
              className="flex-1 flex gap-2"
            >
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                disabled={status !== "ready"}
              />
              <Button
                type="submit"
                disabled={!input.trim() || status !== "ready"}
                size="icon"
              >
                {status === "submitted" || status === "streaming" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SendHorizonal className="h-4 w-4" />
                )}
              </Button>
            </form>
            {(status === "submitted" || status === "streaming") && (
              <Button
                variant="outline"
                onClick={() => stop()}
                className="animate-pulse"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Stop
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
    </ProtectedRoute>
  );
};

export default Chat;

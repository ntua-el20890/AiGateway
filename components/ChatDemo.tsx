"use client"
 
import { useChat } from "ai/react"
 
import { Chat } from "@/components/ui/chat"
 
export function ChatDemo() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    isLoading,
    stop,
  } = useChat()
 
  return (
    <Chat
    messages={messages.map((msg) => ({
        ...msg,
        parts: msg.parts.filter((part) => part.type !== "file"), // Adjust parts to match MessagePart[]
      }))}
      input={input}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      isGenerating={isLoading}
      stop={stop}
      append={append}
      suggestions={[
        "Generate a tasty vegan lasagna recipe for 3 people.",
        "Generate a list of 5 questions for a frontend job interview.",
        "Who won the 2022 FIFA World Cup?",
      ]}
    />
  )
}
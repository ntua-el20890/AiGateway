import React, { useState } from "react";
import { ChatMessage } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pen, Check, X, Copy, CheckCheck, RefreshCw } from "lucide-react";
import { fadeIn } from "@/utils/transitions";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { MemoizedMarkdown } from "@/components/memoized-markdown";

interface ChatMessageProps {
  message: ChatMessage;
  isLastMessage: boolean;
  isLastUserMessage: boolean;
  isLastAiMessage: boolean;
  modelName?: string;
  onEditMessage?: (id: string, content: string) => void;
  onRefreshMessage?: () => void;
  isRefreshing?: boolean;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({
  message,
  isLastMessage,
  isLastUserMessage,
  isLastAiMessage,
  onEditMessage,
  onRefreshMessage,
  modelName,
  isRefreshing = false,
}) => {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(message.content);
  };

  const handleSave = () => {
    if (editedContent.trim() !== "") {
      onEditMessage?.(message.id, editedContent);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(message.content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Message text has been copied to your clipboard",
        duration: 2000,
      });

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  // Don't render empty messages unless they're being refreshed or are the last AI message
  if (!message.content && !isLastAiMessage && !isRefreshing) {
    return null;
  }

  // If it's a streaming message (being refreshed or is empty but last),
  // show it even without content
  const isStreaming = isRefreshing || (isLastAiMessage && !message.content);
  const showEmptyMessage = isStreaming && !message.content;

  const assistantDisplayName =
    !isUser && !isSystem ? modelName || "AI Assistant" : null;

  return (
    <motion.div
      {...fadeIn}
      className={cn(
        "flex w-full my-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex gap-3 max-w-[80%] rounded-lg p-3",
          isUser
            ? "bg-primary text-primary-foreground ml-auto"
            : isSystem
            ? "bg-yellow-500/20 text-foreground border border-yellow-500/30"
            : "bg-secondary/50 mr-auto"
        )}
      >
        {!isUser && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className={isSystem ? "bg-yellow-500" : "bg-muted"}>
              {isSystem ? "S" : "A"}
            </AvatarFallback>
            <AvatarImage src="/placeholder.svg" />
          </Avatar>
        )}

        <div className="flex-1 space-y-1">
          <div className="text-xs font-medium">
            {isUser ? "You" : isSystem ? "System" : assistantDisplayName}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[100px] resize-none text-sm bg-background text-foreground"
                placeholder="Edit your message..."
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="bg-muted text-muted-foreground hover:bg-muted/80"
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  disabled={editedContent.trim() === ""}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-sm whitespace-pre-wrap">
                {showEmptyMessage ? (
                  "Generating..."
                ) : (
                  <MemoizedMarkdown id={message.id} content={message.content} />
                )}
              </div>
              <div className="flex justify-between items-center mt-1">
                <div className="flex items-center gap-2">
                  {isUser && message.edited && (
                    <span
                      className={cn(
                        "text-xs italic mr-2", // Added `mr-2` for spacing
                        "text-primary-foreground/70"
                      )}
                    >
                      (edited)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs",
                      isUser
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    {format(new Date(message.timestamp), "h:mm a")}
                  </span>

                  {!isUser && onRefreshMessage && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-secondary"
                      onClick={onRefreshMessage}
                      disabled={isRefreshing}
                      title="Refresh response"
                    >
                      <RefreshCw
                        className={cn(
                          "h-3 w-3",
                          isRefreshing && "animate-spin"
                        )}
                      />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-6 w-6",
                      isUser
                        ? "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                        : "hover:bg-secondary"
                    )}
                    onClick={handleCopyText}
                    title="Copy message"
                  >
                    {copied ? (
                      <CheckCheck className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                  {isUser && isLastUserMessage && !isEditing && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-6 w-6",
                        isUser
                          ? "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                          : ""
                      )}
                      onClick={handleEdit}
                      title="Edit message"
                    >
                      <Pen className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {isUser && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-primary-foreground text-primary">
              U
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessageComponent;

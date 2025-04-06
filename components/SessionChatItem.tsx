
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ChatMessage } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface SessionChatItemProps {
  message: ChatMessage;
}

const SessionChatItem: React.FC<SessionChatItemProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  
  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex items-start gap-3 max-w-3xl",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <Avatar className={cn(
          "h-8 w-8",
          isUser ? "bg-primary" : isSystem ? "bg-yellow-500" : "bg-zinc-800"
        )}>
          <AvatarFallback>
            {isUser ? 'U' : isSystem ? 'S' : 'A'}
          </AvatarFallback>
        </Avatar>
        
        <div className={cn(
          "rounded-lg px-4 py-3",
          isUser ? "bg-primary text-primary-foreground" : 
          isSystem ? "bg-yellow-500/20 text-foreground border border-yellow-500/30" : 
          "bg-muted text-foreground"
        )}>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-medium">
              {isUser ? 'You' : isSystem ? 'System' : 'AI Assistant'}
            </span>
            <span className="text-xs opacity-70">
              {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
            </span>
          </div>
          <div className="whitespace-pre-wrap text-sm">
            {message.content}
            {message.edited && (
              <span className="text-xs opacity-70 ml-2">(edited)</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionChatItem;
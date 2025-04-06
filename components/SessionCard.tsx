
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Session } from '@/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface SessionCardProps {
  session: Session;
}

const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const getAverageRating = (ratings: Record<string, number>) => {
    const values = Object.values(ratings);
    const sum = values.reduce((acc, val) => acc + val, 0);
    return (sum / values.length).toFixed(1);
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const avgPostRating = getAverageRating({
    qualityOfHelp: session.ratings.postSession.qualityOfHelp,
    thingsLearned: session.ratings.postSession.thingsLearned,
    feelingNow: session.ratings.postSession.feelingNow,
    feelingFuture: session.ratings.postSession.feelingFuture
  });

  return (
    <Card className="relative overflow-hidden animate-scale-in hover-effect">
      <div className="absolute top-0 right-0 mt-4 mr-4">
        <Badge variant="secondary">{session.model}</Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{session.task}</CardTitle>
        <CardDescription>
          {session.phase} - {session.scope}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Language</span>
            <span className="font-medium">{session.language}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-sm text-muted-foreground">Created</span>
            <span className="font-medium">{formatDate(session.createdAt)}</span>
          </div>
        </div>
        <Separator className="my-3" />
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-secondary/50 p-2 text-center">
            <span className="text-xs text-muted-foreground block">Time Saved</span>
            <span className="font-medium text-lg">{session.ratings.postSession.timeSaved}h</span>
          </div>
          <div className="rounded-lg bg-secondary/50 p-2 text-center">
            <span className="text-xs text-muted-foreground block">Rating</span>
            <span className="font-medium text-lg">{avgPostRating}
              <span className="text-xs text-muted-foreground">/5</span>
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {session.ratings.postSession.notes || "No notes added for this session."}
        </p>
      </CardFooter>
    </Card>
  );
};

export default SessionCard;
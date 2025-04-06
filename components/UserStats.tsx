
import React from 'react';
import { useSession } from '@/context/SessionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MessageSquare, Star, Award } from 'lucide-react';
import { Session } from '@/types';

export const UserStats = () => {
  const { sessions } = useSession();
  
  const calculateStats = (userSessions: Session[]) => {
    if (userSessions.length === 0) {
      return {
        totalSessions: 0,
        mostUsedModel: 'None',
        timeSaved: 0,
        avgQualityRating: 0
      };
    }
    
    // Calculate most used model
    const modelCounts: Record<string, number> = {};
    userSessions.forEach(session => {
      modelCounts[session.model] = (modelCounts[session.model] || 0) + 1;
    });
    
    const mostUsedModel = Object.entries(modelCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    // Calculate time saved
    const totalTimeSaved = userSessions.reduce((sum, session) => 
      sum + (session.ratings.postSession.timeSaved || 0), 0);
    
    // Calculate average quality rating
    const avgQuality = userSessions.reduce((sum, session) => 
      sum + (session.ratings.postSession.qualityOfHelp || 0), 0) / userSessions.length;
    
    return {
      totalSessions: userSessions.length,
      mostUsedModel,
      timeSaved: totalTimeSaved,
      avgQualityRating: avgQuality.toFixed(1)
    };
  };
  
  const stats = calculateStats(sessions);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="hover-effect transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.totalSessions}</p>
          <p className="text-sm text-muted-foreground">Total sessions</p>
        </CardContent>
      </Card>
      
      <Card className="hover-effect transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Favorite Model
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold truncate">{stats.mostUsedModel}</p>
          <p className="text-sm text-muted-foreground">Most frequently used</p>
        </CardContent>
      </Card>
      
      <Card className="hover-effect transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Time Saved
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.timeSaved}h</p>
          <p className="text-sm text-muted-foreground">Estimated total</p>
        </CardContent>
      </Card>
      
      <Card className="hover-effect transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Quality Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.avgQualityRating}
            <span className="text-lg text-muted-foreground">/5</span>
          </p>
          <p className="text-sm text-muted-foreground">Average quality</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStats;
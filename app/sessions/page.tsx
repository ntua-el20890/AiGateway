"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  PlusCircle,
  ClipboardList,
  MessageCircle,
  Thermometer,
  MessageSquare,
} from "lucide-react";
import { useSession } from "@/context/SessionContext";
import SessionCard from "@/components/SessionCard";
import SessionChatItem from "@/components/SessionChatItem";
import { sampleSessions } from "@/data/mockData";
import { Session } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DirectionProvider } from "@radix-ui/react-direction";
import { useSession as useNextAuthSession, signOut, signIn } from 'next-auth/react';
import ProtectedRoute from "@/components/ProtectedRoute";
import ThemeToggle from '@/components/ThemeToggle';

const Sessions = () => {
  const router = useRouter();
  const { sessions } = useSession();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const { data: session, status } = useNextAuthSession(); // Get the session from NextAuth
  const isAuthenticated = status === "authenticated"; // Check if the user is authenticated
  const isLoading = status === "loading"; // Check if the session is loading
  const user = session?.user; // Get the user from the session

  const allSessions = [...sessions, ...sampleSessions];

  const openSessionDetails = (session: Session) => {
    setSelectedSession(session);
  };

  const closeSessionDetails = () => {
    setSelectedSession(null);
  };

  const formatDate = (date: Date) => {
    try {
      return new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  const getAverageRating = (ratings: Record<string, number>) => {
    const values = Object.values(ratings);
    const sum = values.reduce((acc, val) => acc + val, 0);
    return (sum / values.length).toFixed(1);
  };

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="mr-4"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">All Sessions</h1>
          </div>
          
    <div className="flex items-center gap-4">
      <ThemeToggle />
          <Button
            onClick={() => router.push("/configure")}
            className="flex items-center"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Session
          </Button>
          </div>
        </div>

        {allSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {allSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => openSessionDetails(session)}
                className="cursor-pointer"
              >
                <SessionCard session={session} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-secondary/50 rounded-lg animate-fade-in">
            <h3 className="text-xl font-medium mb-2">No sessions yet</h3>
            <p className="text-muted-foreground mb-6">
              Start a new session to begin your AI conversation journey
            </p>
            <Button
              onClick={() => router.push("/configure")}
              variant="secondary"
            >
              Create Your First Session
            </Button>
          </div>
        )}
      </div>

      <Dialog open={!!selectedSession} onOpenChange={closeSessionDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          {selectedSession && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {selectedSession.task}
                </DialogTitle>
                <DialogDescription asChild>
                  <div className="flex items-center gap-2 mt-1">
                    <span>{selectedSession.phase}</span>
                    <span>•</span>
                    <span>{selectedSession.scope}</span>
                    <span>•</span>
                    <span>{selectedSession.language}</span>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <DirectionProvider dir="ltr">
                <Tabs defaultValue="metrics" className="mt-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="metrics">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Metrics & Details
                    </TabsTrigger>
                    <TabsTrigger value="chat">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chat History
                    </TabsTrigger>
                  </TabsList>

                  <div className="min-h-[400px]">
                    <TabsContent value="metrics" className="space-y-6 m-0">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="px-2 py-1">
                          {selectedSession.model}
                        </Badge>
                        <Badge variant="secondary" className="px-2 py-1">
                          Created{" "}
                          {formatDistanceToNow(
                            new Date(selectedSession.createdAt),
                            { addSuffix: true }
                          )}
                        </Badge>
                      </div>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">
                            Session Metrics
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-secondary/40 rounded-lg p-3 text-center">
                              <p className="text-sm text-muted-foreground">
                                Time Spent
                              </p>
                              <p className="text-lg font-medium">
                                {
                                  selectedSession.ratings.postSession
                                    .timeAllocated
                                }
                                h
                              </p>
                            </div>
                            <div className="bg-secondary/40 rounded-lg p-3 text-center">
                              <p className="text-sm text-muted-foreground">
                                Time Saved
                              </p>
                              <p className="text-lg font-medium">
                                {selectedSession.ratings.postSession.timeSaved}h
                              </p>
                            </div>
                            <div className="bg-secondary/40 rounded-lg p-3 text-center">
                              <p className="text-sm text-muted-foreground">
                                Messages
                              </p>
                              <p className="text-lg font-medium">
                                {selectedSession.messages.length}
                              </p>
                            </div>
                            <div className="bg-secondary/40 rounded-lg p-3 text-center">
                              <p className="text-sm text-muted-foreground">
                                Average Rating
                              </p>
                              <p className="text-lg font-medium">
                                {getAverageRating({
                                  qualityOfHelp:
                                    selectedSession.ratings.postSession
                                      .qualityOfHelp,
                                  thingsLearned:
                                    selectedSession.ratings.postSession
                                      .thingsLearned,
                                  feelingNow:
                                    selectedSession.ratings.postSession
                                      .feelingNow,
                                  feelingFuture:
                                    selectedSession.ratings.postSession
                                      .feelingFuture,
                                })}
                                <span className="text-xs text-muted-foreground">
                                  /5
                                </span>
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center">
                              <ClipboardList className="mr-2 h-4 w-4" />
                              Pre-Session Ratings
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Skill Level
                                </p>
                                <div className="flex items-center mt-1">
                                  <div className="w-full bg-secondary/40 rounded-full h-2">
                                    <div
                                      className="bg-primary rounded-full h-2"
                                      style={{
                                        width: `${
                                          (selectedSession.ratings.preSession
                                            .skillLevel /
                                            5) *
                                          100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="ml-2 text-sm font-medium">
                                    {
                                      selectedSession.ratings.preSession
                                        .skillLevel
                                    }
                                    /5
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Language Experience
                                </p>
                                <div className="flex items-center mt-1">
                                  <div className="w-full bg-secondary/40 rounded-full h-2">
                                    <div
                                      className="bg-primary rounded-full h-2"
                                      style={{
                                        width: `${
                                          (selectedSession.ratings.preSession
                                            .languageExperience /
                                            5) *
                                          100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="ml-2 text-sm font-medium">
                                    {
                                      selectedSession.ratings.preSession
                                        .languageExperience
                                    }
                                    /5
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  AI Tools Familiarity
                                </p>
                                <div className="flex items-center mt-1">
                                  <div className="w-full bg-secondary/40 rounded-full h-2">
                                    <div
                                      className="bg-primary rounded-full h-2"
                                      style={{
                                        width: `${
                                          (selectedSession.ratings.preSession
                                            .aiToolsFamiliarity /
                                            5) *
                                          100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="ml-2 text-sm font-medium">
                                    {
                                      selectedSession.ratings.preSession
                                        .aiToolsFamiliarity
                                    }
                                    /5
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center">
                              <MessageCircle className="mr-2 h-4 w-4" />
                              Post-Session Feedback
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Quality of Help
                                </p>
                                <div className="flex items-center mt-1">
                                  <div className="w-full bg-secondary/40 rounded-full h-2">
                                    <div
                                      className="bg-primary rounded-full h-2"
                                      style={{
                                        width: `${
                                          (selectedSession.ratings.postSession
                                            .qualityOfHelp /
                                            5) *
                                          100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="ml-2 text-sm font-medium">
                                    {
                                      selectedSession.ratings.postSession
                                        .qualityOfHelp
                                    }
                                    /5
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Things Learned
                                </p>
                                <div className="flex items-center mt-1">
                                  <div className="w-full bg-secondary/40 rounded-full h-2">
                                    <div
                                      className="bg-primary rounded-full h-2"
                                      style={{
                                        width: `${
                                          (selectedSession.ratings.postSession
                                            .thingsLearned /
                                            5) *
                                          100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="ml-2 text-sm font-medium">
                                    {
                                      selectedSession.ratings.postSession
                                        .thingsLearned
                                    }
                                    /5
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Feeling About Future
                                </p>
                                <div className="flex items-center mt-1">
                                  <div className="w-full bg-secondary/40 rounded-full h-2">
                                    <div
                                      className="bg-primary rounded-full h-2"
                                      style={{
                                        width: `${
                                          (selectedSession.ratings.postSession
                                            .feelingFuture /
                                            5) *
                                          100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="ml-2 text-sm font-medium">
                                    {
                                      selectedSession.ratings.postSession
                                        .feelingFuture
                                    }
                                    /5
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <Thermometer className="mr-2 h-4 w-4" />
                            Model Parameters
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Temperature
                              </p>
                              <p className="font-medium">
                                {selectedSession.parameters.temperature}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Max Tokens
                              </p>
                              <p className="font-medium">
                                {selectedSession.parameters.maxTokens}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Top P
                              </p>
                              <p className="font-medium">
                                {selectedSession.parameters.topP}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Frequency Penalty
                              </p>
                              <p className="font-medium">
                                {selectedSession.parameters.frequencyPenalty}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Presence Penalty
                              </p>
                              <p className="font-medium">
                                {selectedSession.parameters.presencePenalty}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {selectedSession.ratings.postSession.notes && (
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Notes</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              {selectedSession.ratings.postSession.notes}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    <TabsContent value="chat" className="space-y-4 m-0">
                      {selectedSession.messages.length > 0 ? (
                        <div className="p-4 bg-secondary/20 rounded-lg max-h-[400px] overflow-y-auto">
                          {selectedSession.messages.map((message) => (
                            <SessionChatItem
                              key={message.id}
                              message={message}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-12 bg-secondary/20 rounded-lg">
                          <MessageSquare className="h-12 w-12 mx-auto opacity-30 mb-4" />
                          <h3 className="text-xl font-medium mb-2">
                            No messages
                          </h3>
                          <p className="text-muted-foreground">
                            This session doesn't contain any chat messages.
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </div>
                </Tabs>
              </DirectionProvider>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </ProtectedRoute>
  );
};

export default Sessions;

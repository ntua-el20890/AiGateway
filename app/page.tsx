"use client";

import React from 'react';
import { useRouter } from 'next/navigation'; // Use Next.js's useRouter
import { Button } from '@/components/ui/button';
import { ArrowRight, PlusCircle, LogOut, Loader } from 'lucide-react';
import SessionCard from '@/components/SessionCard';
import { useSession } from '@/context/SessionContext';
import { sampleSessions } from '@/data/mockData';
import ThemeToggle from '@/components/ThemeToggle';
import { useSession as useNextAuthSession, signOut, signIn } from 'next-auth/react';

const Index = () => {
  const router = useRouter(); // Use Next.js's useRouter
  const { sessions } = useSession();
  const { data: session, status } = useNextAuthSession(); // Get the session from NextAuth
  const isAuthenticated = status === 'authenticated'; // Check if the user is authenticated
  const isLoading = status === 'loading'; // Check if the session is loading
  const user = session?.user; // Get the user from the session
  

  // Combine actual sessions with sample sessions
  const allSessions = [...sessions, ...sampleSessions];

  const handleNavigate = (path: string) => {
    router.push(path); // Use router.push for navigation
  };

  return (
    <div className="min-h-screen bg-background"> 
      <div className="container px-4 py-12 mx-auto max-w-6xl">
         {/* Header with theme toggle and user info */}
         <div className="flex justify-end items-center mb-8">
          <div className="flex items-center gap-4">
            <ThemeToggle/>
            {/* add here auth process */}
            {isLoading ? (
              <Loader className="animate-spin h-5 w-5 text-muted-foreground" />
            ) : isAuthenticated && user ? (
              <>
                <div className="text-sm text-muted-foreground">
                  {user.name} ({user.username})
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    signOut();
                    handleNavigate('/');
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleNavigate('/login')}
              >
                Log in
              </Button>
            )}
            
          </div>
        </div>
        <div className="flex flex-col items-center text-center mb-16 animate-fade-in">
          <div className="inline-block mb-6 p-3 rounded-2xl bg-secondary">
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-primary"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>

          <h1 className="text-4xl font-bold tracking-tight mb-3">
            AI Session Manager
          </h1>

          <p className="text-xl text-muted-foreground max-w-xl mb-8">
            Configure, chat, and evaluate your AI sessions with precision
          </p>

          <Button 
            onClick={() => handleNavigate('/configure')} // Use handleNavigate
            size="lg" 
            className="group px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <PlusCircle className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            Start New Session
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>

        <div className="mb-12 animate-fade-in">
          {isAuthenticated && (
            <>
              <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Sessions</h2>
          <Button 
            variant="ghost" 
            onClick={() => handleNavigate('/sessions')} // Use handleNavigate
            className="flex items-center gap-2"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
              </div>
              {allSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allSessions.slice(0, 3).map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
              ) : (
          <div className="text-center p-12 bg-secondary/50 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No sessions yet</h3>
            <p className="text-muted-foreground mb-6">
              Start a new session to begin your AI conversation journey
            </p>
            <Button 
              onClick={() => {
              if (!isAuthenticated) {
                handleNavigate('/login'); // Redirect to login if not authenticated
              } else {
                handleNavigate('/configure'); // Navigate to configure if authenticated
              }
              }} 
              variant="secondary"
            >
              Create Your First Session
            </Button>
          </div>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
          <div className="bg-secondary/30 rounded-lg p-6 backdrop-blur">
            <h3 className="text-lg font-medium mb-3">Configure</h3>
            <p className="text-muted-foreground mb-4">
              Set up your session parameters and preferences before chatting
            </p>
          </div>
          
          <div className="bg-secondary/30 rounded-lg p-6 backdrop-blur">
            <h3 className="text-lg font-medium mb-3">Chat</h3>
            <p className="text-muted-foreground mb-4">
              Have detailed conversations with AI models customized to your needs
            </p>
          </div>
          
          <div className="bg-secondary/30 rounded-lg p-6 backdrop-blur">
            <h3 className="text-lg font-medium mb-3">Evaluate</h3>
            <p className="text-muted-foreground mb-4">
              Rate your experience and save insights for future reference
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
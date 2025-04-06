"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, CheckCircle } from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import RatingSlider from '@/components/RatingSlider';
import { toast } from '@/hooks/use-toast';
import { ratingOptions } from '@/data/mockData';
import { useSession as useNextAuthSession, signOut, signIn } from 'next-auth/react';
import ProtectedRoute from "@/components/ProtectedRoute";
import ThemeToggle from '@/components/ThemeToggle';


// Custom rating labels for different metrics
const ratingLabels = {
  qualityOfHelp: {
    1: "Not helpful",
    2: "Slightly helpful",
    3: "Moderately helpful",
    4: "Very helpful",
    5: "Extremely helpful"
  },
  thingsLearned: {
    1: "Nothing new",
    2: "A little",
    3: "Some concepts",
    4: "Many things",
    5: "Significant learning"
  },
  feelingNow: {
    1: "Very frustrated",
    2: "Still confused",
    3: "Neutral",
    4: "Confident",
    5: "Very confident"
  },
  feelingFuture: {
    1: "Not at all confident",
    2: "Slightly confident",
    3: "Moderately confident",
    4: "Very confident",
    5: "Extremely confident"
  },
  threatFelt: {
    1: "No threat",
    2: "Mild concern",
    3: "Moderate concern",
    4: "Significant concern",
    5: "Strong threat"
  }
};

interface RatingOption {
  value: number;
  label: string;
  description: string;
}

type RatingType = keyof typeof ratingLabels;

const getCustomOptions = (type: RatingType): RatingOption[] => {
  return ratingOptions.map((option) => ({
    ...option,
    description: ratingLabels[type][option.value as keyof typeof ratingLabels[RatingType]] || option.description
  }));
};

const Evaluate = () => {
  const router = useRouter();
  const { currentSession, completeSession, clearCurrentSession } = useSession();
  
  const [qualityOfHelp, setQualityOfHelp] = useState(3);
  const [thingsLearned, setThingsLearned] = useState(3);
  const [feelingNow, setFeelingNow] = useState(3);
  const [feelingFuture, setFeelingFuture] = useState(3);
  const [threatFelt, setThreatFelt] = useState(1);
  const [timeAllocated, setTimeAllocated] = useState('');
  const [timeSaved, setTimeSaved] = useState('');
  const [notes, setNotes] = useState('');
  const [formErrors, setFormErrors] = useState({
    timeAllocated: false,
    timeSaved: false
  });
  
  // Redirect if no current session
  useEffect(() => {
    if (!currentSession) {
      router.push('/');
    }
  }, [currentSession, router]);

  const validateForm = () => {
    const errors = {
      timeAllocated: !timeAllocated,
      timeSaved: !timeSaved
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleBackToChat = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.history.back();
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all time assessment fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    completeSession(
      qualityOfHelp,
      thingsLearned,
      feelingNow,
      feelingFuture,
      threatFelt,
      parseFloat(timeAllocated),
      parseFloat(timeSaved),
      notes
    );
    
    clearCurrentSession();
    router.push('/sessions');
  };

  if (!currentSession) return null;

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-6">
            <Button 
            variant="ghost" 
            onClick={handleBackToChat}
            className="flex items-center"
            >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Chat
            </Button>
        </div>
        
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl">Evaluate Your Session</CardTitle>
            <CardDescription>
              Please rate your experience with this AI session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Session Ratings</h3>
              
              <RatingSlider
                title="Quality of Help"
                value={qualityOfHelp}
                onChange={setQualityOfHelp}
                options={getCustomOptions('qualityOfHelp')}
                description="How helpful was the AI in solving your problem?"
              />
              
              <RatingSlider
                title="Things Learned"
                value={thingsLearned}
                onChange={setThingsLearned}
                options={getCustomOptions('thingsLearned')}
                description="How much did you learn from this session?"
              />
              
              <RatingSlider
                title="Feeling Now"
                value={feelingNow}
                onChange={setFeelingNow}
                options={getCustomOptions('feelingNow')}
                description="How do you feel about your task now after the session?"
              />
              
              <RatingSlider
                title="Feeling About Future"
                value={feelingFuture}
                onChange={setFeelingFuture}
                options={getCustomOptions('feelingFuture')}
                description="How confident do you feel about future similar tasks?"
              />
              
              <RatingSlider
                title="Threat Felt"
                value={threatFelt}
                onChange={setThreatFelt}
                options={getCustomOptions('threatFelt')}
                description="Did you feel the AI was threatening your job or role?"
              />
            </div>
            
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Time Assessment</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="timeAllocated" className="text-sm font-medium block">
                    Time Allocated (hours) <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="timeAllocated"
                    type="number"
                    min="0"
                    step="1" 
                    value={timeAllocated}
                    onChange={(e) => setTimeAllocated(e.target.value)}
                    className={formErrors.timeAllocated ? "border-destructive" : ""}
                    placeholder="Required"
                  />
                  {formErrors.timeAllocated && (
                    <p className="text-sm text-destructive">This field is required</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="timeSaved" className="text-sm font-medium block">
                    Estimated Time Saved (hours) <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="timeSaved"
                    type="number"
                    min="0"
                    step="1"
                    value={timeSaved}
                    onChange={(e) => setTimeSaved(e.target.value)}
                    className={formErrors.timeSaved ? "border-destructive" : ""}
                    placeholder="Required"
                  />
                  {formErrors.timeSaved && (
                    <p className="text-sm text-destructive">This field is required</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium block">
                Session Notes
              </label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes or feedback about this session..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSubmit}
                className="px-8"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Evaluation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default Evaluate;
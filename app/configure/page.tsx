"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Replace react-router-dom with next/navigation
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Check, Loader } from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import { phases, tasks, scopes, languages, models, ratingOptions, configSteps } from '@/data/mockData';
import StepIndicator from '@/components/StepIndicator';;
import RatingSlider from '@/components/RatingSlider';
import ModelCard from '@/components/ModelCard';
import ApiKeyDialog from '@/components/ApiKeyDialog';
import { useToast } from '@/hooks/use-toast';
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSession as useNextAuthSession, signIn, signOut } from 'next-auth/react';
import { getPhases, getTasks, getScopes, getLanguages } from '@/services/configService';
import { useQuery } from '@tanstack/react-query';
import { modelInfoService } from '@/services/modelInfoService';


const Configure: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useNextAuthSession();
  const { toast } = useToast();
  const { initializeSession } = useSession();


  const [step, setStep] = useState(0);
  const [selectedPhase, setSelectedPhase] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedScope, setSelectedScope] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  
  const [skillLevel, setSkillLevel] = useState(3);
  const [languageExperience, setLanguageExperience] = useState(3);
  const [aiToolsFamiliarity, setAiToolsFamiliarity] = useState(3);
  
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [filteredScopes, setFilteredScopes] = useState(scopes);
  const [filteredLanguages, setFilteredLanguages] = useState(languages);
  
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
    const [apiKey, setApiKey] = useState('');

    const { data: models, isLoading, error } = useQuery({
        queryKey: ['models'],
        queryFn: async () => {
          const token = session?.accessToken;
          console.log('token',token)
          return modelInfoService.getModels(token);
        },
    });

    useEffect(() => {
      if (error) {
        toast({ title: "Error", description: "Failed to load models." });
      }
    }, [error]);


  // Update filtered tasks when phase changes
  useEffect(() => {
    if (selectedPhase) {
      setFilteredTasks(tasks.filter(task => task.phaseId === selectedPhase));
    } else {
      setFilteredTasks([]);
    }
    setSelectedTask('');
    setSelectedScope('');
    setSelectedLanguage('');
  }, [selectedPhase]);

  // Update filtered scopes when task changes
  useEffect(() => {
    if (selectedTask) {
      setFilteredScopes(scopes.filter(scope => scope.taskId === selectedTask));
    } else {
      setFilteredScopes([]);
    }
    setSelectedScope('');
    setSelectedLanguage('');
  }, [selectedTask]);

  // Update filtered languages when scope changes
  useEffect(() => {
    if (selectedScope) {
      setFilteredLanguages(languages.filter(language => language.scopeId === selectedScope));
    } else {
      setFilteredLanguages([]);
    }
    setSelectedLanguage('');
  }, [selectedScope]);

  const handleNext = () => {
    if (step < configSteps.length - 1) {
      setStep(step + 1);
    } else {
        const selectedModelObj = models?.find(m => m.id === selectedModel);
      
      // Check if model requires API key from user
      if (selectedModelObj && selectedModelObj.requiresApiKey) {
        console.log("Opening API key dialog for model:", selectedModelObj.name);
        setShowApiKeyDialog(true);
      } else {
        startSession(false);
      }
    }
  };

  const startSession = (userProvidedApiKey: boolean = false) => {
    // Create a new session with the selected options
    const phaseName = phases.find(p => p.id === selectedPhase)?.name || '';
    const taskName = tasks.find(t => t.id === selectedTask)?.name || '';
    const scopeName = scopes.find(s => s.id === selectedScope)?.name || '';
    const languageName = languages.find(l => l.id === selectedLanguage)?.name || '';
    const modelName = models?.find(m => m.id === selectedModel)?.name || '';
    initializeSession(
      phaseName,
      taskName,
      scopeName,

      languageName,
      modelName,
      skillLevel,
      languageExperience,
      aiToolsFamiliarity,
      //userProvidedApiKey
    );
    
    router.push('/chat');
  };

  const handleApiKeyConfirm = (key: string) => {
    setApiKey(key);
    setShowApiKeyDialog(false);
    
    toast({
      title: "API Key Accepted",
      description: "Your API key will be used for this session only.",
    });
    
    // Start session with user-provided API key
    startSession(true);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      router.push('/');
    }
  };

  const getCurrentStepLabel = () => {
    return configSteps[step]?.title || '';
  };

  const isNextDisabled = () => {
    switch (step) {
      case 0: // Phase selection
        return !selectedPhase;
      case 1: // Task selection
        return !selectedTask;
      case 2: // Scope selection
        return !selectedScope;
      case 3: // Language selection
        return !selectedLanguage;
      case 4: // Ratings
        return false; // Ratings always have default values
      case 5: // Model selection
        return !selectedModel;
      default:
        return false;
    }
  };

  const renderOptionButtons = (
    options: Array<{ id: string; name: string }>,
    selectedOption: string,
    setSelectedOption: (id: string) => void,
    disabled = false
  ) => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 animate-scale-in">
        {options.map(option => (
          <Button
            key={option.id}
            variant={selectedOption === option.id ? "default" : "outline"}
            onClick={() => setSelectedOption(option.id)}
            disabled={disabled}
            className="h-auto py-3 px-4 flex items-center justify-between text-left"
            title={option.name}
          >
            <span className="mr-2 line-clamp-2 text-sm">{option.name}</span>
            {selectedOption === option.id && <Check className="h-4 w-4 flex-shrink-0" />}
          </Button>
        ))}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 0: // Phase selection
        return renderOptionButtons(phases, selectedPhase, setSelectedPhase);
      
      case 1: // Task selection
        return renderOptionButtons(
          filteredTasks, 
          selectedTask, 
          setSelectedTask, 
          !selectedPhase
        );
      
      case 2: // Scope selection
        return renderOptionButtons(
          filteredScopes, 
          selectedScope, 
          setSelectedScope, 
          !selectedTask
        );
      
      case 3: // Language selection
        return renderOptionButtons(
          filteredLanguages, 
          selectedLanguage, 
          setSelectedLanguage, 
          !selectedScope
        );
      
      case 4: // Ratings
        return (
          <div className="space-y-8 mt-6 animate-scale-in">
            <RatingSlider
              title="Your skill level in this task"
              value={skillLevel}
              onChange={setSkillLevel}
              options={ratingOptions}
              description="How experienced are you with this specific task and scope?"
            />
            
            <RatingSlider
              title="Your experience with this language/framework"
              value={languageExperience}
              onChange={setLanguageExperience}
              options={ratingOptions}
              description="How comfortable are you with the selected programming language or framework?"
            />
            
            <RatingSlider
              title="Your familiarity with AI tools"
              value={aiToolsFamiliarity}
              onChange={setAiToolsFamiliarity}
              options={ratingOptions}
              description="How would you rate your experience using AI assistants for coding?"
            />
          </div>
        );
      
      case 5: // Model selection
        return (
          <>
            {isLoading && <Loader className="animate-spin" />}
            {models && <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 animate-scale-in">
            {models.map(model => (
              <ModelCard
                key={model.id}
                model={model}
                selected={selectedModel === model.id}
                onClick={() => setSelectedModel(model.id)}
              />
            ))}
            </div>}
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-3xl animate-fade-in">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="flex items-center"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
            <span className="text-sm font-medium">
              Step {step + 1} of {configSteps.length}
            </span>
          </div>
          
          <StepIndicator 
            steps={configSteps.length} 
            currentStep={step} 
            labels={configSteps.map(s => s.title)}
          />
          
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{getCurrentStepLabel()}</h2>
              <p className="text-muted-foreground mt-1">
                {configSteps[step]?.description}
              </p>
            </div>
            
            {renderStepContent()}
          </div>
          
          <div className="flex justify-end mt-10">
            <Button 
              onClick={handleNext} 
              disabled={isNextDisabled()}
              className="px-8"
            >
              {step === configSteps.length - 1 ? 'Start Session' : 'Next'}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <ApiKeyDialog 
        modelName={models?.find(m => m.id === selectedModel)?.name || ''}
        isOpen={showApiKeyDialog}
        onClose={() => setShowApiKeyDialog(false)}
        onConfirm={handleApiKeyConfirm}
      />
    </div>
    </ProtectedRoute>
  );
};

export default Configure;
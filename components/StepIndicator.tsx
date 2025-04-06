import React from 'react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  steps: number;
  currentStep: number;
  labels?: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  steps, 
  currentStep,
  labels = []
}) => {
  return (
    <div className="w-full flex items-center justify-between mb-8">
      {Array.from({ length: steps }).map((_, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                index < currentStep 
                  ? "bg-primary text-background" // Ensure text is readable on completed steps
                  : index === currentStep 
                    ? "bg-primary/90 text-background ring-4 ring-primary/20" // Ensure text is readable on the current step
                    : "bg-secondary text-muted-foreground"
              )}
            >
              {index < currentStep ? (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            {labels[index] && (
              <span 
                className={cn(
                  "mt-2 text-xs font-medium",
                  index === currentStep 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                {labels[index]}
              </span>
            )}
          </div>
          {index < steps - 1 && (
            <div 
              className={cn(
                "flex-1 h-1 mx-2",
                index < currentStep 
                  ? "bg-primary" 
                  : "bg-secondary"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;

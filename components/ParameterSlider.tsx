
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ParameterSliderProps {
  name: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  description: string;
  className?: string;
}

const ParameterSlider: React.FC<ParameterSliderProps> = ({
  name,
  value,
  onChange,
  min,
  max,
  step,
  description,
  className,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label htmlFor={name} className="text-sm font-medium">
            {name}
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className="text-sm font-medium">{value}</span>
      </div>
      <Slider
        id={name}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(newValue) => onChange(newValue[0])}
      />
    </div>
  );
};

export default ParameterSlider;

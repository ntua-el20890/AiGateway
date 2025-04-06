import React from 'react';
import { Slider } from '@/components/ui/slider';
import { RatingOption } from '@/types';

interface RatingSliderProps {
  title: string;
  value: number;
  onChange: (value: number) => void;
  options: RatingOption[];
  description?: string;
}

const RatingSlider: React.FC<RatingSliderProps> = ({
  title,
  value,
  onChange,
  options,
  description,
}) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col">
        <h3 className="text-base font-medium mb-1">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
      </div>
      <div className="pt-2">
        <Slider
          defaultValue={[value]}
          min={1}
          max={5}
          step={1}
          onValueChange={(val) => onChange(val[0])}
          className="w-full"
        />
        <div className="flex justify-between mt-2">
          {options.map((option) => (
            <div 
              key={option.value} 
              className="flex flex-col items-center"
            >
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                value === option.value 
                  ? 'bg-primary text-background' // Ensure text is readable in dark mode
                  : 'text-muted-foreground'
              }`}>
                {option.label}
              </span>
              <span className="text-xs text-muted-foreground mt-1 text-center">
                {option.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingSlider;


import React from 'react';
import { Model } from '@/types';
import { CheckIcon, ImageIcon, LaptopIcon, CloudIcon, KeyIcon, ServerIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ExtendedModel } from '@/config/modelConfig';

interface ModelCardProps {
  model: Model | ExtendedModel;
  selected: boolean;
  onClick: () => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, selected, onClick }) => {
  // Check if the model has provider information (ExtendedModel)
  const extendedModel = model as ExtendedModel;
  const hasProviderInfo = Boolean(extendedModel.provider);

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover-effect",
        selected 
          ? "border-primary ring-2 ring-primary/20" 
          : "hover:border-primary/40",
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2 relative">
        <div className="absolute top-3 right-3">
          {selected && (
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
              <CheckIcon className="text-white h-4 w-4" />
            </div>
          )}
        </div>
        <CardTitle className="text-lg flex items-center gap-2">
          {model.name}
          {model.runsLocally ? (
            <Badge variant="outline" className="ml-1 bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
              <LaptopIcon className="h-3 w-3" />
              <span className="text-xs">Local</span>
            </Badge>
          ) : (
            <div className="flex gap-1">
              <Badge variant="outline" className="ml-1 bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                <CloudIcon className="h-3 w-3" />
                <span className="text-xs">Cloud</span>
              </Badge>
              {extendedModel.requiresApiKey ? (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
                  <KeyIcon className="h-3 w-3" />
                  <span className="text-xs">API Key</span>
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                  <KeyIcon className="h-3 w-3" />
                  <span className="text-xs">Key Provided</span>
                </Badge>
              )}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground pb-2">
        <p>{model.description}</p>
        {hasProviderInfo && (
          <div className="mt-2 flex items-center gap-1 text-xs">
            <ServerIcon className="h-3 w-3" />
            <span>Provider: {extendedModel.provider}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <span>{model.contextLength.toLocaleString()} tokens</span>
        </div>
        {model.supportsImages && (
          <div className="flex items-center gap-1">
            <ImageIcon className="h-3 w-3" />
            <span>Vision</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ModelCard;
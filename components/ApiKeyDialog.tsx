import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApiKeyDialogProps {
  modelName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (apiKey: string) => void;
}

const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({
  modelName,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Clear input and errors when dialog opens or closes
  useEffect(() => {
    if (isOpen) {
      setApiKey("");
      setValidationError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiKey.trim()) return;

    setIsValidating(true);
    setValidationError(null);

    try {
      // Simulate API key validation - in a real app, this would check with the actual API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock validation - you would replace this with real validation
      const isValid = apiKey.length > 10; // Simple mock validation

      if (isValid) {
        onConfirm(apiKey.trim());
      } else {
        setValidationError(
          "Invalid API key format. Please check your key and try again."
        );
      }
    } catch (error) {
      setValidationError("Failed to validate API key. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API Key Required</DialogTitle>
          <DialogDescription>
            The model {modelName} requires an API key to function.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <Alert
            variant="default"
            className="bg-amber-50 text-amber-900 border-amber-200"
          >
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              We do not store your API key on our servers. It will only be used
              for this session.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Input
              id="apiKey"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className={cn("w-full", validationError && "border-red-500")}
              required
              autoComplete="off"
              disabled={isValidating}
            />

            {validationError && (
              <p className="text-sm text-red-500">{validationError}</p>
            )}
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isValidating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!apiKey.trim() || isValidating}>
              {isValidating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyDialog;

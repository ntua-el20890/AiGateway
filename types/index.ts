
export interface Session {
  id: string;
  createdAt: Date;
  phase: string;
  task: string;
  scope: string;
  language: string;
  model: string;
  ratings: {
    preSession: {
      skillLevel: number;
      languageExperience: number;
      aiToolsFamiliarity: number;
    };
    postSession: {
      qualityOfHelp: number;
      thingsLearned: number;
      feelingNow: number;
      feelingFuture: number;
      threatFelt: number;
      timeAllocated: number;
      timeSaved: number;
      notes: string;
    };
  };
  parameters: ModelParameters;
  messages: ChatMessage[];
  totalTokensUsed?: number;
  timeSpent?: number;
  completionTime?: Date;
  userEditCount?: number;
  aiResponseCount?: number;
  errorCount?: number;
  userProvidedApiKey?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  edited?: boolean;
}

export interface ModelParameters {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export interface Phase {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  phaseId: string;
  name: string;
}

export interface Scope {
  id: string;
  taskId: string;
  name: string;
}

export interface Language {
  id: string;
  scopeId: string;
  name: string;
}

export interface Model {
  id: string;
  name: string;
  description: string;
  supportsImages: boolean;
  contextLength: number;
  runsLocally?: boolean;
  requiresApiKey?: boolean;
}

export interface Rating {
  value: number;
  label: string;
}

export interface RatingOption {
  value: number;
  label: string;
  description: string;
}

export interface ConfigStep {
  id: string;
  title: string;
  description: string;
}

export interface RatingLabels {
  [key: string]: {
    title: string;
    labels: {
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
    }
  }
}
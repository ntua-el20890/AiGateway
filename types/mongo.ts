
import { ObjectId } from 'mongodb';

export interface MongoPhase {
  _id: ObjectId;
  name: string;
}

export interface MongoTask {
  _id: ObjectId;
  phaseId: string;
  name: string;
}

export interface MongoScope {
  _id: ObjectId;
  taskId: string;
  name: string;
}

export interface MongoLanguage {
  _id: ObjectId;
  scopeId: string;
  name: string;
}

export interface MongoModel {
  _id: ObjectId;
  name: string;
  description: string;
  supportsImages: boolean;
  contextLength: number;
  runsLocally?: boolean;
  requiresApiKey?: boolean;
  provider: string;
}

export interface MongoSession {
  _id: string;
  userId: string;
  createdAt: Date;
  phase: string;
  task: string;
  scope: string;
  language: string;
  model: string;
  totalTokensUsed: number;
  timeSpent: number;
  completionTime?: Date;
  userEditCount: number;
  aiResponseCount: number;
  errorCount: number;
  userProvidedApiKey: boolean;
}

export interface MongoMessage {
  _id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  edited: boolean;
}

export interface MongoModelParameters {
  sessionId: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export interface MongoSessionRatings {
  _id: string;
  sessionId: string;
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
}

export interface MongoUser {
  _id: string;
  supabaseId: string;
  email: string;
  name: string;
  schoolId?: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}
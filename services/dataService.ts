import { connectToDatabase, COLLECTIONS } from './mongoService';
import { Phase, Task, Scope, Language, Model, Session, ChatMessage, ModelParameters } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';

/**
 * Fetch all phases from the database
 */
export async function fetchPhases(): Promise<Phase[]> {
  try {
    const db = await connectToDatabase();
    const phases = await db.collection(COLLECTIONS.PHASES).find({}).toArray();
    return phases.map(phase => ({
      id: phase._id.toString(),
      name: phase.name
    }));
  } catch (error) {
    console.error("Error fetching phases:", error);
    // Return mock data if database connection fails
    return [
      { id: "design", name: "Design" },
      { id: "development", name: "Development" },
      { id: "testing", name: "Testing" },
      { id: "deployment", name: "Deployment" }
    ];
  }
}

/**
 * Fetch tasks for a specific phase
 */
export async function fetchTasks(phaseId: string): Promise<Task[]> {
  try {
    const db = await connectToDatabase();
    const tasks = await db.collection(COLLECTIONS.TASKS).find({ phaseId }).toArray();
    return tasks.map(task => ({
      id: task._id.toString(),
      phaseId: task.phaseId,
      name: task.name
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    // Return mock data if database connection fails
    return [
      { id: "requirements", phaseId: "design", name: "Requirements Gathering" },
      { id: "wireframing", phaseId: "design", name: "Wireframing" },
      { id: "coding", phaseId: "development", name: "Coding" },
      { id: "unit-testing", phaseId: "testing", name: "Unit Testing" }
    ].filter(task => task.phaseId === phaseId);
  }
}

/**
 * Fetch scopes for a specific task
 */
export async function fetchScopes(taskId: string): Promise<Scope[]> {
  try {
    const db = await connectToDatabase();
    const scopes = await db.collection(COLLECTIONS.SCOPES).find({ taskId }).toArray();
    return scopes.map(scope => ({
      id: scope._id.toString(),
      taskId: scope.taskId,
      name: scope.name
    }));
  } catch (error) {
    console.error("Error fetching scopes:", error);
    // Return mock data if database connection fails
    return [];
  }
}

/**
 * Fetch languages for a specific scope
 */
export async function fetchLanguages(scopeId: string): Promise<Language[]> {
  try {
    const db = await connectToDatabase();
    const languages = await db.collection(COLLECTIONS.LANGUAGES).find({ scopeId }).toArray();
    return languages.map(language => ({
      id: language._id.toString(),
      scopeId: language.scopeId,
      name: language.name
    }));
  } catch (error) {
    console.error("Error fetching languages:", error);
    // Return mock data if database connection fails
    return [];
  }
}

/**
 * Fetch all available models
 */
export async function fetchModels(): Promise<Model[]> {
  try {
    const db = await connectToDatabase();
    const models = await db.collection(COLLECTIONS.MODELS).find({}).toArray();
    return models.map(model => ({
      id: model._id.toString(),
      name: model.name,
      description: model.description,
      supportsImages: model.supportsImages,
      contextLength: model.contextLength,
      runsLocally: model.runsLocally || false,
      requiresApiKey: model.requiresApiKey || false
    }));
  } catch (error) {
    console.error("Error fetching models:", error);
    // Return mock data if database connection fails
    return [];
  }
}

/**
 * Save a new session to the database
 */
export async function saveSession(session: Session): Promise<string> {
  try {
    const db = await connectToDatabase();
    
    // Create a MongoDB friendly object from the session
    const mongoSession = {
      _id: new ObjectId(session.id),
      createdAt: session.createdAt,
      phase: session.phase,
      task: session.task,
      scope: session.scope,
      language: session.language,
      model: session.model,
      ratings: session.ratings,
      totalTokensUsed: session.totalTokensUsed || 0,
      timeSpent: session.timeSpent || 0,
      completionTime: session.completionTime,
      userEditCount: session.userEditCount || 0,
      aiResponseCount: session.aiResponseCount || 0,
      errorCount: session.errorCount || 0,
      userProvidedApiKey: session.userProvidedApiKey || false
    };
    
    // Save the session
    await db.collection(COLLECTIONS.SESSIONS).insertOne(mongoSession);
    
    // Save the session parameters
    await db.collection(COLLECTIONS.MODEL_PARAMETERS).insertOne({
      sessionId: session.id,
      ...session.parameters
    });
    
    // Save the session messages
    if (session.messages && session.messages.length > 0) {
      const messageBatch = session.messages.map(msg => ({
        _id: new ObjectId(msg.id),
        sessionId: session.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        edited: msg.edited || false
      }));
      
      await db.collection(COLLECTIONS.MESSAGES).insertMany(messageBatch);
    }
    
    // Save ratings if available
    if (session.ratings) {
      await db.collection(COLLECTIONS.SESSION_RATINGS).insertOne({
        _id: new ObjectId(),
        sessionId: session.id,
        preSession: session.ratings.preSession,
        postSession: session.ratings.postSession
      });
    }
    
    return session.id;
  } catch (error) {
    console.error("Error saving session:", error);
    throw error;
  }
}

/**
 * Fetch all sessions for a user
 */
export async function fetchUserSessions(userId: string): Promise<Session[]> {
  try {
    const db = await connectToDatabase();
    const sessions = await db.collection(COLLECTIONS.SESSIONS).find({ userId }).toArray();
    
    // Map sessions to frontend type
    const mappedSessions = await Promise.all(sessions.map(async (session) => {
      // Fetch parameters
      const parameters = await db.collection(COLLECTIONS.MODEL_PARAMETERS)
        .findOne({ sessionId: session._id });
      
      // Fetch messages
      const messages = await db.collection(COLLECTIONS.MESSAGES)
        .find({ sessionId: session._id })
        .sort({ timestamp: 1 })
        .toArray();
      
      // Fetch ratings
      const ratings = await db.collection(COLLECTIONS.SESSION_RATINGS)
        .findOne({ sessionId: session._id });
      
      return {
        id: session._id.toString(),
        createdAt: session.createdAt,
        phase: session.phase,
        task: session.task,
        scope: session.scope,
        language: session.language,
        model: session.model,
        ratings: ratings ? {
          preSession: ratings.preSession,
          postSession: ratings.postSession
        } : {
          preSession: {
            skillLevel: 3,
            languageExperience: 3,
            aiToolsFamiliarity: 3
          },
          postSession: {
            qualityOfHelp: 0,
            thingsLearned: 0,
            feelingNow: 0,
            feelingFuture: 0,
            threatFelt: 0,
            timeAllocated: 0,
            timeSaved: 0,
            notes: ""
          }
        },
        parameters: parameters ? {
          temperature: parameters.temperature,
          maxTokens: parameters.maxTokens,
          topP: parameters.topP,
          frequencyPenalty: parameters.frequencyPenalty,
          presencePenalty: parameters.presencePenalty
        } : {
          temperature: 0.7,
          maxTokens: 1000,
          topP: 1,
          frequencyPenalty: 0,
          presencePenalty: 0
        },
        messages: messages.map(msg => ({
          id: msg._id.toString(),
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content,
          timestamp: msg.timestamp,
          edited: msg.edited
        })),
        totalTokensUsed: session.totalTokensUsed || 0,
        timeSpent: session.timeSpent || 0,
        completionTime: session.completionTime,
        userEditCount: session.userEditCount || 0,
        aiResponseCount: session.aiResponseCount || 0,
        errorCount: session.errorCount || 0,
        userProvidedApiKey: session.userProvidedApiKey || false
      };
    }));
    
    return mappedSessions;
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    return [];
  }
}

/**
 * Initialize database with seed data (for development)
 */
export async function seedDatabase() {
  try {
    const db = await connectToDatabase();
    
    // Check if data already exists
    const phasesCount = await db.collection(COLLECTIONS.PHASES).countDocuments();
    
    if (phasesCount === 0) {
      // Seed phases
      await db.collection(COLLECTIONS.PHASES).insertMany([
        { name: "Design" },
        { name: "Development" },
        { name: "Testing" },
        { name: "Deployment" }
      ]);
      
      // Get the inserted phases to use their IDs
      const phases = await db.collection(COLLECTIONS.PHASES).find({}).toArray();
      
      // Seed tasks with phase IDs
      const designPhase = phases.find(p => p.name === "Design");
      const devPhase = phases.find(p => p.name === "Development");
      
      if (designPhase && devPhase) {
        await db.collection(COLLECTIONS.TASKS).insertMany([
          { phaseId: designPhase._id.toString(), name: "Requirements Gathering" },
          { phaseId: designPhase._id.toString(), name: "Wireframing" },
          { phaseId: devPhase._id.toString(), name: "Frontend Development" },
          { phaseId: devPhase._id.toString(), name: "Backend Development" }
        ]);
      }
      
      // Seed models
      await db.collection(COLLECTIONS.MODELS).insertMany([
        { 
          name: "GPT-4o", 
          description: "Most advanced model with vision capabilities", 
          supportsImages: true,
          contextLength: 128000,
          runsLocally: false,
          requiresApiKey: true,
          provider: "openai"
        },
        { 
          name: "Claude 3 Opus", 
          description: "High quality reasoning and coding assistance", 
          supportsImages: true,
          contextLength: 200000,
          runsLocally: false,
          requiresApiKey: true,
          provider: "anthropic"
        }
      ]);
      
      console.log("Database seeded successfully");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
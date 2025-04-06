
import { MongoClient, ServerApiVersion, Db } from 'mongodb';

// Connection URI - should be stored in environment variables in production
const uri = process.env.MONGODB_URI || "mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient instance
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database connection cache
let cachedDb: Db | null = null;

/**
 * Connect to MongoDB and return the database instance
 */
export async function connectToDatabase(): Promise<Db> {
  // If we have a cached connection, return it
  if (cachedDb) {
    return cachedDb;
  }

  try {
    // Connect the client to the server
    await client.connect();
    
    // Get a reference to the database
    const db = client.db("ai_session_manager");
    
    // Cache the database connection
    cachedDb = db;
    
    console.log("Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  // In a real application, use a proper hashing library like bcrypt
  // For simplicity, we're using a placeholder implementation
  return `hashed_${password}`;
}

// Verify a password
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  // Compare the hashed passwords
  return `hashed_${plainPassword}` === hashedPassword;
}

// Collections names (similar to tables in SQL)
export const COLLECTIONS = {
  PHASES: "phases",
  TASKS: "tasks",
  SCOPES: "scopes",
  LANGUAGES: "languages",
  MODELS: "models",
  SESSIONS: "sessions",
  USERS: "users",
  MODEL_PARAMETERS: "model_parameters",
  MESSAGES: "messages",
  SESSION_RATINGS: "session_ratings"
};

// Close the connection when the application shuts down
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
});
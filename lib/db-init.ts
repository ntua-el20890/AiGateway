
import { seedDatabase } from '@/services/dataService';
import { createUser } from './auth';

/**
 * Initialize the MongoDB database with seed data
 * This is useful for development environments
 */
export async function initializeDatabase() {
  // In production, we might want to skip seeding
  if (process.env.NODE_ENV !== 'production') {
    console.log('Initializing database with seed data...');
    try {
      await seedDatabase();
      
      // Create a default user for testing
      const defaultUserCreated = await createUser('admin', 'password123', 'Administrator');
      if (defaultUserCreated) {
        console.log('Created default user: admin');
      } else {
        console.log('Default user already exists');
      }
    } catch (error) {
      console.error('Failed to seed database:', error);
    }
  }
}
// services/modelInfoService.ts
import { Model } from '../types';

const API_URL = 'http://localhost:3001/api/models'; 

export const modelInfoService = {
  async getModels(): Promise<Model[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }
      const models: Model[] = await response.json();
      //logging the models for debugging
      console.log('Fetched models:', models);
      return models;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  },
};
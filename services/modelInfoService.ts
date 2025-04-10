// services/modelInfoService.ts
import { Model } from '../types';

const API_URL = '/api/models'; // Replace with your actual Model Info Service URL if different

export const modelInfoService = {
  async getModels(): Promise<Model[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }
      const models: Model[] = await response.json();
      return models;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  },
};
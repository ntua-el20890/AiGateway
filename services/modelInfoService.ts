import { Model } from '../types';

const API_URL = 'http://localhost:3001/api/models'; 

export const modelInfoService = {
  async getModels(token?: string): Promise<Model[]> {
    try {
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        // console.log('Authorization Header:', headers['Authorization']); // Debug log
      }
      const response = await fetch(API_URL, {
        headers,
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }
      const models: Model[] = await response.json();
      console.log('Fetched models:', models); // Debug log
      return models;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  },
};
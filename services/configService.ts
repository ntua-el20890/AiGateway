
import { fetchPhases, fetchTasks, fetchScopes, fetchLanguages, fetchModels } from './dataService';
import { phases, tasks, scopes, languages, models } from '@/data/mockData';
import { Phase, Task, Scope, Language, Model } from '@/types';

/**
 * Get all phases for the configuration
 */
export async function getPhases(): Promise<Phase[]> {
  try {
    return await fetchPhases();
  } catch (error) {
    console.error("Error fetching phases from database:", error);
    return phases; // Fallback to mock data
  }
}

/**
 * Get tasks for a specific phase
 */
export async function getTasks(phaseId: string): Promise<Task[]> {
  try {
    return await fetchTasks(phaseId);
  } catch (error) {
    console.error("Error fetching tasks from database:", error);
    return tasks.filter(task => task.phaseId === phaseId); // Fallback to mock data
  }
}

/**
 * Get scopes for a specific task
 */
export async function getScopes(taskId: string): Promise<Scope[]> {
  try {
    return await fetchScopes(taskId);
  } catch (error) {
    console.error("Error fetching scopes from database:", error);
    return scopes.filter(scope => scope.taskId === taskId); // Fallback to mock data
  }
}

/**
 * Get languages for a specific scope
 */
export async function getLanguages(scopeId: string): Promise<Language[]> {
  try {
    return await fetchLanguages(scopeId);
  } catch (error) {
    console.error("Error fetching languages from database:", error);
    return languages.filter(language => language.scopeId === scopeId); // Fallback to mock data
  }
}

/**
 * Get all available models
 */
export async function getModels(): Promise<Model[]> {
  try {
    return await fetchModels();
  } catch (error) {
    console.error("Error fetching models from database:", error);
    return models; // Fallback to mock data
  }
}
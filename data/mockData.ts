import { 
  Phase, 
  Task, 
  Scope, 
  Language, 
  Model, 
  Session,
  RatingOption 
} from '@/types';
import { ExtendedModel } from '@/config/modelConfig';

export const phases: Phase[] = [
  { id: 'requirements-gathering', name: 'Requirements Gathering' },
  { id: 'requirements-specification', name: 'Requirements Specification' },
  { id: 'architecture', name: 'Architecture' },
  { id: 'design', name: 'Design' },
  { id: 'coding', name: 'Coding' },
  { id: 'testing', name: 'Testing' },
  { id: 'deployment', name: 'Deployment' }
];

export const tasks: Task[] = [
  { id: 'application-domain-understanding', phaseId: 'requirements-gathering', name: 'Application Domain Understanding' },
  { id: 'stakeholder-statement', phaseId: 'requirements-specification', name: 'Stakeholder Statement' },
  { id: 'requirements-functional', phaseId: 'requirements-specification', name: 'Requirements (Functional)' },
  { id: 'requirements-non-functional', phaseId: 'requirements-specification', name: 'Requirements (Non-Functional)' },
  { id: 'use-case-specification', phaseId: 'requirements-specification', name: 'Use Case Specification' },
  { id: 'architectural-style-selection', phaseId: 'architecture', name: 'Architectural Style Selection' },
  { id: 'architectural-decision', phaseId: 'architecture', name: 'Architectural Decision' },
  { id: 'design-decision', phaseId: 'design', name: 'Design Decision' },
  { id: 'data-design', phaseId: 'design', name: 'Data Design' },
  { id: 'source-code-authoring', phaseId: 'coding', name: 'Source Code Authoring' },
  { id: 'unit-testing', phaseId: 'testing', name: 'Unit Testing' },
  { id: 'functional-testing', phaseId: 'testing', name: 'Functional Testing' },
  { id: 'integration-testing', phaseId: 'testing', name: 'Integration Testing' },
  { id: 'performance-testing', phaseId: 'testing', name: 'Performance Testing' },
  { id: 'user-acceptance-testing', phaseId: 'testing', name: 'User Acceptance Testing (UAT)' },
  { id: 'container-operations', phaseId: 'deployment', name: 'Container Operations' },
  { id: 'network-operations', phaseId: 'deployment', name: 'Network Operations' },
  { id: 'dev-ops', phaseId: 'deployment', name: 'Dev-Ops' },
  { id: 'code-management', phaseId: 'deployment', name: 'Code Management' }
];

export const scopes: Scope[] = [
  // Requirements Gathering
  { id: 'documentation-text', taskId: 'application-domain-understanding', name: 'Documentation (Text)' },

  // Requirements Specification
  { id: 'uml-use-case', taskId: 'stakeholder-statement', name: 'UML Use Case' },
  { id: 'uml-object', taskId: 'requirements-functional', name: 'UML Object' },
  { id: 'uml-activity', taskId: 'requirements-non-functional', name: 'UML Activity' },
  { id: 'uml-sequence', taskId: 'use-case-specification', name: 'UML Sequence' },

  // Architecture
  { id: 'uml-component', taskId: 'architectural-style-selection', name: 'UML Component' },
  { id: 'uml-deployment', taskId: 'architectural-decision', name: 'UML Deployment' },
  { id: 'uml-class', taskId: 'architectural-decision', name: 'UML Class' },
  { id: 'uml-other', taskId: 'architectural-decision', name: 'UML Other' },
  { id: 'database-design-er', taskId: 'architectural-decision', name: 'Database Design (ER)' },
  { id: 'non-uml', taskId: 'architectural-decision', name: 'Non-UML' },

  // Design
  { id: 'uml-activity', taskId: 'design-decision', name: 'UML Activity' },
  { id: 'uml-sequence', taskId: 'design-decision', name: 'UML Sequence' },
  { id: 'uml-component', taskId: 'design-decision', name: 'UML Component' },
  { id: 'uml-deployment', taskId: 'design-decision', name: 'UML Deployment' },
  { id: 'uml-class', taskId: 'design-decision', name: 'UML Class' },
  { id: 'uml-state', taskId: 'design-decision', name: 'UML State' },
  { id: 'uml-other', taskId: 'design-decision', name: 'UML Other' },
  { id: 'ux-design', taskId: 'design-decision', name: 'UX Design' },
  { id: 'er-diagram', taskId: 'design-decision', name: 'ER Diagram' },

  // Coding
  { id: 'frontend', taskId: 'source-code-authoring', name: 'Frontend' },
  { id: 'backend', taskId: 'source-code-authoring', name: 'Backend' },
  { id: 'api', taskId: 'source-code-authoring', name: 'API' },
  { id: 'cli', taskId: 'source-code-authoring', name: 'CLI' },

  // Testing
  { id: 'test-cases', taskId: 'unit-testing', name: 'Test Cases' },
  { id: 'test-code-driver', taskId: 'unit-testing', name: 'Test Code Driver' },
  { id: 'test-execution-scripts', taskId: 'functional-testing', name: 'Test Execution Scripts' },
  { id: 'deployment-scripts', taskId: 'integration-testing', name: 'Deployment Scripts' },
  { id: 'code-management-actions', taskId: 'performance-testing', name: 'Code Management Actions' }
];

export const languages: Language[] = [
  { id: 'n-a', scopeId: 'documentation-text', name: 'N/A' },
  { id: 'js-node', scopeId: 'uml-use-case', name: 'JS / Node' },
  { id: 'python', scopeId: 'uml-object', name: 'Python' },
  { id: 'sql', scopeId: 'uml-activity', name: 'SQL' },
  { id: 'nosql-db', scopeId: 'uml-sequence', name: 'NoSQL DB' },
  { id: 'java', scopeId: 'uml-component', name: 'Java' },
  { id: 'shell', scopeId: 'uml-deployment', name: 'Shell' },
  { id: 'c-cpp', scopeId: 'uml-class', name: 'C/C++' },
  { id: 'php', scopeId: 'uml-other', name: 'PHP' },
  { id: 'typescript', scopeId: 'frontend', name: 'TypeScript' },
  { id: 'yaml-json', scopeId: 'backend', name: 'YAML/JSON' },
  { id: 'c-sharp', scopeId: 'api', name: 'C#' },
  { id: 'other-proglang', scopeId: 'cli', name: 'Other Programming Language' },
  { id: 'md', scopeId: 'test-cases', name: 'Markdown' },
  { id: 'txt-doc', scopeId: 'test-code-driver', name: 'Text/Document' },
  { id: 'client-server', scopeId: 'test-execution-scripts', name: 'Client-Server' },
  { id: 'multi-tier', scopeId: 'deployment-scripts', name: 'Multi-Tier' },
  { id: 'microservices', scopeId: 'code-management-actions', name: 'Microservices' }
];

export const models: ExtendedModel[] = [
  { 
    id: 'gpt-4o', 
    name: 'GPT-4o', 
    description: 'Most advanced model with vision capabilities', 
    supportsImages: true,
    contextLength: 128000,
    runsLocally: false,
    provider: 'openai',
    requiresApiKey: true
  },
  { 
    id: 'gpt-4o-mini', 
    name: 'GPT-4o Mini', 
    description: 'Fast and efficient for most tasks', 
    supportsImages: true,
    contextLength: 128000,
    runsLocally: false,
    provider: 'openai',
    requiresApiKey: false
  },
  { 
    id: 'claude-3-opus', 
    name: 'Claude 3 Opus', 
    description: 'High quality reasoning and coding assistance', 
    supportsImages: true,
    contextLength: 200000,
    runsLocally: false,
    provider: 'anthropic',
    requiresApiKey: false
  },
  { 
    id: 'claude-3-sonnet', 
    name: 'Claude 3 Sonnet', 
    description: 'Balanced model for general use cases', 
    supportsImages: true,
    contextLength: 180000,
    runsLocally: false,
    provider: 'anthropic',
    requiresApiKey: false
  },
  { 
    id: 'gemini-pro', 
    name: 'Gemini Pro', 
    description: 'Google\'s advanced model for various tasks', 
    supportsImages: true,
    contextLength: 32000,
    runsLocally: false,
    provider: 'google',
    requiresApiKey: true
  },
  { 
    id: 'llama-3-70b', 
    name: 'Llama 3 (70B)', 
    description: 'Open-source model with strong coding capabilities', 
    supportsImages: false,
    contextLength: 8000,
    runsLocally: true,
    provider: 'local-llama',
    requiresApiKey: false
  },
  { 
    id: 'gemma', 
    name: 'gemma', 
    description: 'Lightweight model running locally on Ollama', 
    supportsImages: false,
    contextLength: 8000,
    runsLocally: true,
    provider: 'local-ollama',
    requiresApiKey: false
  },
  {
    id: 'gemma3',
    name: 'gemma3',
    description: 'Latest version of gemma with improved performance',
    supportsImages: false,
    contextLength: 8000,
    runsLocally: true,
    provider: 'local-ollama',
    requiresApiKey: false
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'Advanced model for deep learning and data analysis',
    supportsImages: true,
    contextLength: 64000,
    runsLocally: false,
    provider: 'deepseek',
    requiresApiKey: true
  },
  {
    id: 'chatgpt-4o-mini',
    name: 'ChatGPT 4o Mini',
    description: 'Mini version of ChatGPT 4o for quick tasks',
    supportsImages: false,
    contextLength: 8000,
    runsLocally: false,
    provider: 'openai',
    requiresApiKey: true
  }
];

export const ratingOptions: RatingOption[] = [
  { value: 1, label: '1', description: 'Novice' },
  { value: 2, label: '2', description: 'Beginner' },
  { value: 3, label: '3', description: 'Intermediate' },
  { value: 4, label: '4', description: 'Advanced' },
  { value: 5, label: '5', description: 'Expert' }
];

export const configSteps = [
  {
    id: 'phase',
    title: 'Select Phase',
    description: 'What phase of the software development lifecycle are you in?'
  },
  {
    id: 'task',
    title: 'Select Task',
    description: 'What specific task are you working on?'
  },
  {
    id: 'scope',
    title: 'Select Scope',
    description: 'What is the scope of your current work?'
  },
  {
    id: 'language',
    title: 'Select Language',
    description: 'What programming language or framework are you using?'
  },
  {
    id: 'ratings',
    title: 'Your Experience',
    description: 'Rate your experience level in these areas'
  },
  {
    id: 'model',
    title: 'Select AI Model',
    description: 'Choose the AI model you want to work with'
  }
];

export const sampleSessions: Session[] = [
  {
    id: '1',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    phase: 'Development',
    task: 'Frontend Development',
    scope: 'UI Components',
    language: 'React',
    model: 'GPT-4o',
    ratings: {
      preSession: {
        skillLevel: 4,
        languageExperience: 4,
        aiToolsFamiliarity: 3
      },
      postSession: {
        qualityOfHelp: 5,
        thingsLearned: 4,
        feelingNow: 4,
        feelingFuture: 5,
        threatFelt: 1,
        timeAllocated: 2,
        timeSaved: 4,
        notes: 'The AI helped me refactor my component structure very efficiently.'
      }
    },
    parameters: {
      temperature: 0.7,
      maxTokens: 1000,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0
    },
    messages: []
  },
  {
    id: '2',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    phase: 'Testing',
    task: 'Integration Testing',
    scope: 'API Testing',
    language: 'JavaScript',
    model: 'Claude 3 Sonnet',
    ratings: {
      preSession: {
        skillLevel: 3,
        languageExperience: 4,
        aiToolsFamiliarity: 2
      },
      postSession: {
        qualityOfHelp: 4,
        thingsLearned: 5,
        feelingNow: 5,
        feelingFuture: 4,
        threatFelt: 1,
        timeAllocated: 1.5,
        timeSaved: 3,
        notes: 'Learned a lot about test structure and mocking strategies.'
      }
    },
    parameters: {
      temperature: 0.5,
      maxTokens: 2000,
      topP: 1,
      frequencyPenalty: 0.2,
      presencePenalty: 0.1
    },
    messages: []
  },
  {
    id: '3',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    phase: 'Deployment',
    task: 'CI/CD Setup',
    scope: 'GitHub Actions',
    language: 'YAML',
    model: 'GPT-4o Mini',
    ratings: {
      preSession: {
        skillLevel: 2,
        languageExperience: 2,
        aiToolsFamiliarity: 4
      },
      postSession: {
        qualityOfHelp: 5,
        thingsLearned: 5,
        feelingNow: 4,
        feelingFuture: 4,
        threatFelt: 1,
        timeAllocated: 1,
        timeSaved: 5,
        notes: 'Set up my entire CI pipeline with help from the AI. Very impressed.'
      }
    },
    parameters: {
      temperature: 0.3,
      maxTokens: 1500,
      topP: 0.9,
      frequencyPenalty: 0,
      presencePenalty: 0
    },
    messages: []
  }
];
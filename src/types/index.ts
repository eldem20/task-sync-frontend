export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  name: string; 
  priority: TaskPriority;
  isCompleted: boolean;
  createdAt: string;
  userId: string;
  scheduledDate?: string; 
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  workInterval?: number;    
  breakInterval?: number;   
  intervalsCount?: number;  
}

export interface Statistics {
  total: number;
  completed: number;
  today: number;
  week: number;
}

export interface AuthData {
  email: string;
  password: string;
}

export interface CreateTaskData {
  name: string;
  priority: TaskPriority;
  scheduledDate?: string; 
}

export interface UserSettings {
  workInterval: number;    
  breakInterval: number;    
  intervalsCount: number;  
}
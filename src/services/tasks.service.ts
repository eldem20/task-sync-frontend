import { api } from './api';
import type { Task, CreateTaskData, TaskPriority } from '../types';

export interface TaskDto {
  name: string;
  priority?: TaskPriority;
  isCompleted?: boolean;
}

export const tasksService = {
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get('/user/tasks');
    return response.data;
  },
  
createTask: async (taskData: CreateTaskData): Promise<Task> => {
  const taskDto: TaskDto = {
    name: taskData.name,
    priority: taskData.priority,
    isCompleted: false  
  };
  

    
    const response = await api.post('/user/tasks', taskDto);
    return response.data;
  },

  updateTask: async (id: string, updates: Partial<TaskDto>): Promise<Task> => {
    const response = await api.put(`/user/tasks/${id}`, updates);
    return response.data;
  },
  
  deleteTask: async (id: string): Promise<Task> => {
    const response = await api.delete(`/user/tasks/${id}`);
    return response.data;
  }
};
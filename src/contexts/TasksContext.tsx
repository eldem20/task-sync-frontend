import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Task, CreateTaskData, TaskPriority } from '../types';
import { tasksService } from '../services/tasks.service';

// ============= ДОБАВЛЕНО =============
const IS_DEMO_MODE = true; // true для Vercel, false для локальной разработки
// =====================================

interface TasksContextType {
  tasks: Task[];
  isLoading: boolean;
  addTask: (taskData: CreateTaskData) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  changeTaskDate: (taskId: string, newDate: Date) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

interface TasksProviderProps {
  children: ReactNode;
}

export const TasksProvider: React.FC<TasksProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const savedTasks = localStorage.getItem('tasks');
      let localTasks: Task[] = [];
      
      if (savedTasks) {
        try {
          localTasks = JSON.parse(savedTasks);
          console.log('📁 Loaded from localStorage:', localTasks.length, 'tasks');
        } catch (e) {
          console.error('❌ Error parsing localStorage:', e);
        }
      }

      // ============= ИЗМЕНЕНО =============
      if (IS_DEMO_MODE) {
        // В демо-режиме только localStorage
        setTasks(localTasks);
        console.log('✅ Demo mode: loaded', localTasks.length, 'tasks');
      } else {
        // В реальном режиме - мержим с сервером
        const tasksFromServer = await tasksService.getTasks();
        console.log('🌐 Loaded from server:', tasksFromServer.length, 'tasks');

        const mergedTasks = tasksFromServer.map(serverTask => {
          const localTask = localTasks.find(t => t.id === serverTask.id);
          
          return {
            id: serverTask.id,
            name: serverTask.name || 'Без названия',
            priority: serverTask.priority || 'medium',
            isCompleted: serverTask.isCompleted || false,
            createdAt: serverTask.createdAt || new Date().toISOString(),
            userId: serverTask.userId || 'unknown',
            scheduledDate: localTask?.scheduledDate || serverTask.scheduledDate
          };
        });

        const localOnlyTasks = localTasks.filter(localTask => 
          !tasksFromServer.some(serverTask => serverTask.id === localTask.id)
        );

        const allTasks = [...mergedTasks, ...localOnlyTasks];
        
        setTasks(allTasks);
        localStorage.setItem('tasks', JSON.stringify(allTasks));
        
        console.log('✅ Merged total:', allTasks.length, 'tasks');
      }
      // =====================================
      
    } catch (error) {
      console.error('❌ Failed to load tasks:', error);
      try {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
          const parsedTasks = JSON.parse(savedTasks);
          setTasks(parsedTasks);
        }
      } catch (localError) {
        console.error('❌ Failed to load from localStorage:', localError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (taskData: CreateTaskData) => {
    setIsLoading(true);
    try {
      // ============= ДОБАВЛЕНО =============
      if (IS_DEMO_MODE) {
        const newTask: Task = {
          id: 'demo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
          name: taskData.name,
          priority: taskData.priority || 'medium',
          isCompleted: false,
          createdAt: new Date().toISOString(),
          userId: 'demo-user',
          scheduledDate: taskData.scheduledDate
        };
        
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setIsLoading(false);
        return;
      }
      // =====================================

      const newTask = await tasksService.createTask(taskData);
      const formattedTask: Task = {
        id: newTask.id,
        name: newTask.name || taskData.name,
        priority: newTask.priority || taskData.priority || 'medium',
        isCompleted: newTask.isCompleted || false,
        createdAt: newTask.createdAt,
        userId: newTask.userId || 'unknown',
        scheduledDate: taskData.scheduledDate
      };
      
      setTasks(prevTasks => [...prevTasks, formattedTask]);
      localStorage.setItem('tasks', JSON.stringify([...tasks, formattedTask]));
      
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = async (taskId: string) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;
      
      // ============= ДОБАВЛЕНО =============
      if (!IS_DEMO_MODE) {
        await tasksService.updateTask(taskId, {
          isCompleted: !taskToUpdate.isCompleted
        });
      }
      // =====================================
      
      const updatedTasks = tasks.map(task =>
        task.id === taskId
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      );
      
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const changeTaskDate = async (taskId: string, newDate: Date): Promise<void> => {
    try {
      const formattedDate = newDate.toISOString().split('T')[0];
      console.log(`📅 Changing task ${taskId} to date: ${formattedDate}`);
      
      const updatedTasks = tasks.map(task => 
        task.id === taskId 
          ? { ...task, scheduledDate: formattedDate }
          : task
      );
      
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      console.log('💾 Saved to localStorage');
      
    } catch (error) {
      console.error('Error changing task date:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      // ============= ДОБАВЛЕНО =============
      if (!IS_DEMO_MODE) {
        await tasksService.deleteTask(taskId);
      }
      // =====================================
      
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  };

  const refreshTasks = async () => {
    await loadTasks();
  };

  const value: TasksContextType = {
    tasks,
    isLoading,
    addTask,
    toggleTask,
    deleteTask,
    changeTaskDate,
    refreshTasks
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = (): TasksContextType => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type { UserSettings } from '../types';
import { userService, type StatisticItem, type UserProfileResponse } from '../services/user.service';


const IS_DEMO_MODE = true; 

interface UserContextType {
  settings: UserSettings;
  statistics: StatisticItem[];
  userProfile: UserProfileResponse['user'] | null;
  isLoading: boolean;
  error: string | null;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  loadProfile: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {

  const defaultSettings: UserSettings = {
    workInterval: 50,
    breakInterval: 10,
    intervalsCount: 7
  };

  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [statistics, setStatistics] = useState<StatisticItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfileResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (IS_DEMO_MODE) {
        const savedSettings = localStorage.getItem('pomodoroSettings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings(parsed);
        } else {
          setSettings(defaultSettings);
        }
        
        const savedTasks = localStorage.getItem('tasks');
        let tasks = [];
        if (savedTasks) {
          tasks = JSON.parse(savedTasks);
        }
        
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((t: any) => t.isCompleted).length;
        
        setStatistics([
          { label: "Total", value: totalTasks },
          { label: "Completed tasks", value: completedTasks },
          { label: "Today tasks", value: 0 },
          { label: "Week tasks", value: 0 },
        ]);
        
        setUserProfile({
          id: 'demo-user',
          email: 'demo@example.com',
          name: 'Demo User',
          workInterval: settings.workInterval,
          breakInterval: settings.breakInterval,
          intervalsCount: settings.intervalsCount,
          createdAt: new Date().toISOString()
        });
      } else {
        const profile = await userService.getProfile();
        setUserProfile(profile.user);

        const userSettings: UserSettings = {
          workInterval: profile.user.workInterval || 50,
          breakInterval: profile.user.breakInterval || 10,
          intervalsCount: profile.user.intervalsCount || 7
        };
        
        setSettings(userSettings);
        setStatistics(profile.statistics || []);
        
        localStorage.setItem('pomodoroSettings', JSON.stringify(userSettings));
      }
      
    } catch (err) {
      console.error('Ошибка загрузки профиля:', err);
      setError('Не удалось загрузить профиль');

      try {
        const savedSettings = localStorage.getItem('pomodoroSettings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings(parsed);
        }
      } catch (localError) {
        console.error('Ошибка загрузки из localStorage:', localError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {

      if (!IS_DEMO_MODE) {
        await userService.updateProfile(newSettings);
      }


      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      
      localStorage.setItem('pomodoroSettings', JSON.stringify(updatedSettings));
      
      if (!IS_DEMO_MODE) {
        await loadProfile();
      }
      
    } catch (err) {
      console.error('Ошибка обновления настроек:', err);
      throw err;
    }
  };

  const contextValue: UserContextType = {
    settings,
    statistics,
    userProfile,
    isLoading,
    error,
    updateSettings,
    loadProfile
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
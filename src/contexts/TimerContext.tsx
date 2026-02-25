import React, { createContext, useContext } from 'react';
import { useUser } from '../hooks/useUser';
import { usePomodoroTimer } from '../hooks/usePomodoroTime';

interface TimerContextType {

  timeLeft: number;
  formattedTime: string;
  isRunning: boolean;
  isBreak: boolean;
  completedRounds: number;
  progress: number;
  isLoading: boolean;
  

  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  

  totalIntervals: number;
  workSeconds: number;
  breakSeconds: number;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useUser();
  
  if (!settings) {
    return <>{children}</>;
  }
  
  const workSeconds = settings.workInterval * 60;
  const breakSeconds = settings.breakInterval * 60;
  
  const timer = usePomodoroTimer(workSeconds, breakSeconds);
  
  const value: TimerContextType = {
    timeLeft: timer.timeLeft,
    formattedTime: timer.formattedTime,
    isRunning: timer.isRunning,
    isBreak: timer.isBreak,
    completedRounds: timer.completedRounds,
    progress: timer.progress,
    isLoading: timer.isLoading,
    startTimer: timer.startTimer,
    pauseTimer: timer.pauseTimer,
    resetTimer: timer.resetTimer,
    totalIntervals: settings.intervalsCount,
    workSeconds,
    breakSeconds
  };
  
  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within TimerProvider');
  }
  return context;
};
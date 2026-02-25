import { useState, useEffect, useCallback, useRef } from 'react';
import { timerService, type PomodoroSession } from '../services/timer.service';


const IS_DEMO_MODE = true; // true для Vercel


export const usePomodoroTimer = (workSeconds: number, breakSeconds: number, totalIntervals: number = 7) => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<PomodoroSession | null>(null);
  const [currentRoundId, setCurrentRoundId] = useState<string>('');
  

  const [timeLeft, setTimeLeft] = useState<number>(workSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedRounds, setCompletedRounds] = useState(0);
  
  const timerRef = useRef<number | null>(null);


  const saveProgress = useCallback(async () => {
    if (!currentRoundId || IS_DEMO_MODE) return;
    
    try {
      const totalSecondsPassed = isBreak 
        ? workSeconds + (breakSeconds - timeLeft)
        : workSeconds - timeLeft;
      
      await timerService.updateRound(currentRoundId, {
        totalSeconds: totalSecondsPassed,
        isCompleted: false
      });
      
      console.log(`💾 Прогресс сохранен: ${totalSecondsPassed} сек`);
    } catch (error) {
      console.error('Ошибка сохранения прогресса:', error);
    }
  }, [currentRoundId, isBreak, timeLeft, workSeconds, breakSeconds]);


  const handleTimeUp = useCallback(async () => {
    console.log('⏰ handleTimeUp called', { isBreak, completedRounds, totalIntervals });
    
    try {
      if (!isBreak) {

        console.log('💤 Начинается перерыв');
        setIsBreak(true);
        setTimeLeft(breakSeconds);
        
        if (!IS_DEMO_MODE) {
          await timerService.updateRound(currentRoundId, {
            totalSeconds: workSeconds,
            isCompleted: false
          });
        }
        
      } else {

        console.log('✅ Раунд завершен!');
        
        const newCompleted = completedRounds + 1;
        console.log('📊 completedRounds:', completedRounds, '->', newCompleted);
        setCompletedRounds(newCompleted);
        
        if (!IS_DEMO_MODE) {
          await timerService.updateRound(currentRoundId, {
            totalSeconds: workSeconds + breakSeconds,
            isCompleted: true
          });
        }
        

        if (newCompleted >= totalIntervals) {
          console.log('🏆 Все раунды завершены!');
          setIsRunning(false);
          setTimeLeft(workSeconds);
          setIsBreak(false);
          
          if (!IS_DEMO_MODE && session?.id) {
            await timerService.updateSession(session.id, { isCompleted: true });
          }
        } else {

          console.log('➡️ Переход к следующему раунду');
          setIsBreak(false);
          setTimeLeft(workSeconds);
          
          if (!IS_DEMO_MODE && session) {
            const nextRound = session.rounds.find(r => !r.isCompleted && r.id !== currentRoundId);
            if (nextRound) {
              setCurrentRoundId(nextRound.id);
            }
          } else {
            setCurrentRoundId('demo-round-' + (newCompleted + 1));
          }
        }
      }
    } catch (error) {
      console.error('Ошибка при завершении интервала:', error);
    }
  }, [session, currentRoundId, isBreak, completedRounds, workSeconds, breakSeconds, totalIntervals]);


  useEffect(() => {
    const initTimer = async () => {
      try {
        setIsLoading(true);
        
        if (IS_DEMO_MODE) {
          console.log('🎮 Демо-режим: инициализация таймера', { workSeconds, breakSeconds, totalIntervals });
          setTimeLeft(workSeconds);
          setIsBreak(false);
          setCompletedRounds(0);
          setCurrentRoundId('demo-round-1');
          setIsLoading(false);
          return;
        }
        

        const sessionData = await timerService.createOrGetSession();
        setSession(sessionData);
        
        const completed = sessionData.rounds.filter(r => r.isCompleted).length;
        setCompletedRounds(completed);
        
        const activeRound = sessionData.rounds.find(r => !r.isCompleted);
        
        if (activeRound) {
          setCurrentRoundId(activeRound.id);
          
          const savedSeconds = activeRound.totalSeconds;
          
          if (savedSeconds > 0) {
            if (savedSeconds >= workSeconds) {
              setIsBreak(true);
              const breakTimePassed = savedSeconds - workSeconds;
              const timeRemaining = breakSeconds - breakTimePassed;
              setTimeLeft(Math.max(0, timeRemaining));
            } else {
              setIsBreak(false);
              setTimeLeft(workSeconds - savedSeconds);
            }
          } else {
            setTimeLeft(workSeconds);
            setIsBreak(false);
          }
        } else {
          const firstRound = sessionData.rounds[0];
          if (firstRound) {
            setCurrentRoundId(firstRound.id);
          }
          setTimeLeft(workSeconds);
          setIsBreak(false);
        }
      } catch (error) {
        console.error('Ошибка инициализации таймера:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initTimer();
  }, [workSeconds, breakSeconds, totalIntervals]);


  useEffect(() => {
    if (!isRunning || !currentRoundId) return;
    
    console.log('▶️ Таймер запущен', { isBreak, timeLeft });
    
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {

          console.log('⏰ Время вышло!');
          handleTimeUp();
          return isBreak ? breakSeconds : workSeconds;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current !== null) {
        console.log('⏹️ Таймер остановлен');
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, isBreak, currentRoundId, workSeconds, breakSeconds, handleTimeUp]);


  useEffect(() => {
    if (!isRunning || !currentRoundId || IS_DEMO_MODE) return;
    
    const saveInterval = window.setInterval(async () => {
      await saveProgress();
    }, 10000);
    
    return () => clearInterval(saveInterval);
  }, [isRunning, currentRoundId, saveProgress]);


  const startTimer = useCallback(() => {
    console.log('▶️ startTimer called');
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(async () => {
    console.log('⏸️ pauseTimer called');
    setIsRunning(false);
    if (!IS_DEMO_MODE) {
      await saveProgress();
    }
  }, [saveProgress]);

  const resetTimer = useCallback(async () => {
    console.log('🔄 resetTimer called');
    
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRunning(false);
    
    if (IS_DEMO_MODE) {
      setTimeLeft(workSeconds);
      setIsBreak(false);
      setCompletedRounds(0);
      setCurrentRoundId('demo-round-' + Date.now());
      console.log('🔄 Таймер сброшен (demo)');
      return;
    }
    
    try {
      if (session?.id) {
        await timerService.deleteSession(session.id);
      }
      
      const newSession = await timerService.createOrGetSession();
      setSession(newSession);
      
      const activeRound = newSession.rounds.find(r => !r.isCompleted);
      if (activeRound) {
        setCurrentRoundId(activeRound.id);
      }
      
      setTimeLeft(workSeconds);
      setIsBreak(false);
      setCompletedRounds(0);
      
      console.log('🔄 Таймер сброшен');
    } catch (error) {
      console.error('Ошибка сброса таймера:', error);
    }
  }, [session, workSeconds]);

  const progress = useCallback(() => {
    const totalTime = isBreak ? breakSeconds : workSeconds;
    return 1 - (timeLeft / totalTime);
  }, [timeLeft, isBreak, workSeconds, breakSeconds]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const getSquareStatus = useCallback((index: number) => {
    if (index < completedRounds) {
      return 'completed';
    } else if (index === completedRounds && isRunning) {
      return isBreak ? 'completed' : 'active'; 
    } else {
      return 'empty'; 
    }
  }, [completedRounds, isRunning, isBreak]);

  return {
    isLoading,
    timeLeft,
    formattedTime,
    minutes,
    seconds,
    isRunning,
    isBreak,
    completedRounds,
    progress: progress(),
    currentRoundId,
    session,
    
    startTimer,
    pauseTimer,
    resetTimer,
    saveProgress,
    getSquareStatus
  };
};
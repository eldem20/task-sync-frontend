import { api } from './api';

export interface PomodoroRound {
  id: string;
  totalSeconds: number;
  isCompleted: boolean;
  createdAt: string;
}

export interface PomodoroSession {
  id: string;
  isCompleted: boolean;
  userId: string;
  createdAt: string;
  rounds: PomodoroRound[];
}

export interface TimerRoundDto {
  totalSeconds: number;
  isCompleted?: boolean;
}

export interface TimerSessionDto {
  isCompleted: boolean;
}

class TimerService {

async deleteTodaySession(): Promise<void> {
  try {
    const session = await this.getTodaySession();
    if (session?.id) {
      await this.deleteSession(session.id);
    }
  } catch (error) {
    console.error('Ошибка удаления сессии:', error);
  }
}

  async getTodaySession(): Promise<PomodoroSession | null> {
    try {
      const response = await api.get('/user/timer/today');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404 || error.response?.data === null) {
        return null;
      }
      throw error;
    }
  }

  async getSession(): Promise<PomodoroSession | null> {
    return await this.getTodaySession();
  }

  async createSession(): Promise<PomodoroSession> {
    const response = await api.post('/user/timer');
    return response.data;
  }

  async createOrGetSession(): Promise<PomodoroSession> {
    const existing = await this.getTodaySession();
    if (existing) return existing;
    
    return await this.createSession();
  }

  async updateRound(roundId: string, data: TimerRoundDto): Promise<PomodoroRound> {
    const response = await api.put(`/user/timer/round/${roundId}`, data);
    return response.data;
  }

  async updateSession(sessionId: string, data: TimerSessionDto): Promise<PomodoroSession> {
    const response = await api.put(`/user/timer/${sessionId}`, data);
    return response.data;
  }

  async deleteSession(sessionId: string): Promise<PomodoroSession> {
    const response = await api.delete(`/user/timer/${sessionId}`);
    return response.data;
  }

  async getActiveRound(session: PomodoroSession): Promise<PomodoroRound | null> {
    if (!session || !session.rounds || session.rounds.length === 0) {
      return null;
    }

    const sortedRounds = [...session.rounds].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    for (const round of sortedRounds) {
      if (!round.isCompleted) {
        return round;
      }
    }

    return sortedRounds[0] || null;
  }

  async getCurrentRound(session: PomodoroSession, workSeconds: number, breakSeconds: number): Promise<{ round: PomodoroRound | null, isBreak: boolean }> {
    const activeRound = await this.getActiveRound(session);
    
    if (!activeRound) {
      return { round: null, isBreak: false };
    }

    const isBreak = activeRound.totalSeconds <= breakSeconds && activeRound.totalSeconds !== workSeconds;
    
    return { round: activeRound, isBreak };
  }
}

export const timerService = new TimerService();
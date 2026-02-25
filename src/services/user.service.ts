
import { api } from './api';


export interface StatisticItem {
  label: string;
  value: number;
}


export interface UserProfileResponse {
  user: {
    id: string;
    email: string;
    name?: string;
    workInterval?: number;
    breakInterval?: number;
    intervalsCount?: number;
    createdAt: string;
  };
  statistics: StatisticItem[];
}

export interface UpdateProfileData {
  email?: string;
  name?: string;
  password?: string;
  workInterval?: number;
  breakInterval?: number;
  intervalsCount?: number;
}

export const userService = {
 
  getProfile: async (): Promise<UserProfileResponse> => {
    const response = await api.get('/user/profile');
    return response.data;
  },
  

  updateProfile: async (data: UpdateProfileData) => {
    const response = await api.put('/user/profile', data);
    return response.data;
  }
};
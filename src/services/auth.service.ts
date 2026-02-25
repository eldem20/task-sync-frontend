import { api } from './api';


export interface LoginData {
  email: string;
  password: string;
}


export interface RegisterData {
  email: string;
  password: string;
  name?: string; 
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
    workInterval?: number;
    breakInterval?: number;
    intervalsCount?: number;
  };
  accessToken: string;
  refreshToken: string;
}

export const authService = {
 
  login: async (email: string, password: string): Promise<AuthResponse> => {

    const response = await api.post('/auth/login', {
        email: email, 
        password: password
    })

    return response.data
    
  },
  

  register: async (email: string, password: string, name?: string): Promise<AuthResponse> => {

        const response = await api.post('/auth/register', {

            email: email,
            password: password,
            name: name
        })

        return response.data
  },
  

  logout: async (): Promise<boolean> => {
    
    const response = await api.post('/auth/logout', {

    })

    return response.data

  }
};
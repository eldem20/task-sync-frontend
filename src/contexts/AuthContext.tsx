import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import type { ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';

// ============= ДОБАВЬ ЭТОТ КОД =============
// Временный демо-режим для Vercel
const IS_DEMO_MODE = true; // Поставь true для Vercel, false для локальной разработки

const DEMO_USER: User = {
    id: 'demo-123',
    email: 'demo@example.com',
    name: 'Demo User',
    workInterval: 50,
    breakInterval: 10,
    intervalsCount: 7
};
// ============================================

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log('🔍 AuthProvider: проверка localStorage');
        
        // ============= ИЗМЕНЕНИЕ =============
        if (IS_DEMO_MODE) {
            // В демо-режиме пробуем загрузить из localStorage, иначе null
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch {
                    setUser(null);
                }
            }
            setIsLoading(false);
            return;
        }
        // ======================================

        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('accessToken');
        
        console.log('🔍 Found in localStorage:', {
            hasUser: !!savedUser,
            hasToken: !!savedToken
        });
        
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                console.log('✅ AuthProvider: загружен пользователь:', parsedUser.email);
                setUser(parsedUser);
            } catch (error) {
                console.error('❌ AuthProvider: ошибка парсинга user:', error);
                localStorage.removeItem('user');
            }
        }
        console.log('🏁 AuthProvider: завершена инициализация');
        setIsLoading(false);
    }, []);

    const register = async (email: string, password: string, name: string) => {
        console.log('🚀 AuthProvider.register: запуск');
        setIsLoading(true);

        // ============= ДОБАВЛЕНО =============
        if (IS_DEMO_MODE) {
            console.log('🎭 Демо-режим: регистрация');
            // Просто создаем пользователя в localStorage
            const newUser: User = {
                id: 'demo-' + Date.now(),
                email: email,
                name: name,
                workInterval: 50,
                breakInterval: 10,
                intervalsCount: 7
            };
            
            localStorage.setItem('user', JSON.stringify(newUser));
            localStorage.setItem('accessToken', 'demo-token');
            setUser(newUser);
            setIsLoading(false);
            return;
        }
        // ======================================

        try {
            const response = await authService.register(email, password, name);
            console.log('✅ AuthProvider.register: успех', response);
            
            const { user: userData, accessToken, refreshToken } = response;

            console.log('💾 Сохраняем токены в localStorage');
            localStorage.setItem('accessToken', accessToken);
            
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
                console.log('💾 Refresh token сохранен');
            }
            
            const user: User = {
                id: userData.id,
                email: userData.email,
                name: userData.name || name,
                workInterval: userData.workInterval || 50,
                breakInterval: userData.breakInterval || 10,
                intervalsCount: userData.intervalsCount || 7
            };

            console.log('👤 Сохраняем пользователя:', user.email);
            localStorage.setItem('user', JSON.stringify(user));          
            console.log('🔄 AuthProvider: вызываем setUser');
            setUser(user);
            console.log('🔄 AuthProvider: user установлен');

            return Promise.resolve(); 

        } catch (error: any) {
            console.error('❌ AuthProvider.register: ошибка', error);
            
            let errorMessage = 'Ошибка регистрации';
            
            if (error.response?.data?.message) {
                const message = error.response.data.message;
 
                if (Array.isArray(message)) {
                    errorMessage = message.join(', ');
                } else {
                    errorMessage = message;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            if (errorMessage.includes('already exists') || errorMessage.includes('User already')) {
                errorMessage = 'Пользователь с таким email уже существует';
            } else if (errorMessage.includes('password') && errorMessage.includes('6')) {
                errorMessage = 'Пароль должен быть не менее 6 символов';
            } else if (errorMessage.includes('email')) {
                errorMessage = 'Введите корректный email адрес';
            } else if (errorMessage.includes('400')) {
                errorMessage = 'Неверные данные. Проверьте email и пароль';
            }
            
            throw new Error(errorMessage);
        } finally {
            console.log('🏁 AuthProvider.register: завершено');
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        console.log('🚀 AuthProvider.login: запуск');
        setIsLoading(true);

        // ============= ДОБАВЛЕНО =============
        if (IS_DEMO_MODE) {
            console.log('🎭 Демо-режим: логин');
            // В демо-режиме пускаем всех с любым паролем
            const newUser: User = {
                id: 'demo-' + Date.now(),
                email: email,
                name: email.split('@')[0],
                workInterval: 50,
                breakInterval: 10,
                intervalsCount: 7
            };
            
            localStorage.setItem('user', JSON.stringify(newUser));
            localStorage.setItem('accessToken', 'demo-token');
            setUser(newUser);
            setIsLoading(false);
            return;
        }
        // ======================================

        try {
            const response = await authService.login(email, password);
            console.log('✅ AuthProvider.login: успех', response);
            
            const { user: userData, accessToken, refreshToken } = response;

            console.log('💾 Сохраняем токены в localStorage');
            localStorage.setItem('accessToken', accessToken);
            
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
                console.log('💾 Refresh token сохранен');
            }
            
            const user: User = {
                id: userData.id,
                email: userData.email,
                name: userData.name || email.split('@')[0],
                workInterval: userData.workInterval || 50,
                breakInterval: userData.breakInterval || 10,
                intervalsCount: userData.intervalsCount || 7
            };

            console.log('👤 Сохраняем пользователя:', user.email);
            localStorage.setItem('user', JSON.stringify(user));
            
            console.log('🔄 AuthProvider: вызываем setUser');
            setUser(user);
            console.log('🔄 AuthProvider: user установлен');

            return Promise.resolve(); 

        } catch (error: any) {
            console.error('❌ AuthProvider.login: ошибка', error);
            
            let errorMessage = 'Ошибка входа';
            
            if (error.response?.data?.message) {
                const message = error.response.data.message;
                errorMessage = Array.isArray(message) ? message.join(', ') : message;
            } else if (error.message) {
                errorMessage = error.message;
            }
 
            if (errorMessage.includes('Invalid credentials') || errorMessage.includes('401')) {
                errorMessage = 'Неверный email или пароль';
            } else if (errorMessage.includes('400')) {
                errorMessage = 'Неверные данные для входа';
            } else if (errorMessage.includes('password') && errorMessage.includes('6')) {
                errorMessage = 'Пароль должен быть не менее 6 символов';
            }
            
            throw new Error(errorMessage);
        } finally {
            console.log('🏁 AuthProvider.login: завершено');
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            if (!IS_DEMO_MODE) {  // ← ДОБАВЛЕНО
                await authService.logout();
            }
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    };

    const updateUser = async (userData: Partial<User>) => {
        try {
            if (user) {
                if (!IS_DEMO_MODE) {  // ← ДОБАВЛЕНО
                    await userService.updateProfile(userData);
                }
                const updatedUser = { ...user, ...userData };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (error) {
            console.error('Ошибка обновления пользователя:', error);
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
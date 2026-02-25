import React, { useEffect, type ReactElement } from 'react';
import './HomePage.css';
import Header from '../components/layout/Header';
import FilterTab from '../components/filters/StatCard';
import TaskItem from '../components/tasks/TaskItem';
import BottomNav from '../components/layout/BottomNav';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../contexts/TasksContext';
import { useUser } from '../hooks/useUser';
import type { Task } from '../types';
import { useMediaQuery } from 'react-responsive';


interface HomePageProps {
    totalValue: number;
    completedValue: number;
    todayValue: number;
    weekValue: number;
    todayTasks: Task[];
    isLoadingTasks: boolean;
    renderTask: (task: Task) => React.ReactElement;
    handleHomePlusClick: () => void;
}


const MobileHomePage: React.FC<HomePageProps> = ({
    totalValue,
    completedValue,
    todayValue,
    weekValue,
    todayTasks,
    isLoadingTasks,
    renderTask,
    handleHomePlusClick
}) => {
    return (
        <div className="home-page mobile">
            <Header />

            <div className="home-page-content">
                <div className="filters-grid">
                    <h1 className='stat'>Statistics</h1>

                    <div className="filters-row">
                        <FilterTab
                            title="Total"
                            value={totalValue}
                            isActive={false}
                        />
                        <FilterTab
                            title="Completed"
                            value={completedValue}
                            isActive={true}
                        />
                    </div>

                    <div className="filters-row">
                        <FilterTab
                            title="Today"
                            value={todayValue}
                            isActive={true}
                        />
                        <FilterTab
                            title="Week"
                            value={weekValue}
                            isActive={false}
                        />
                    </div>
                </div>

                <div className="today-tasks">
                    <div className="tasks-list">
                        <h2 className="section-title">Today's Tasks</h2>
                        
                        {isLoadingTasks ? (
                            <div className="loading">Loading tasks...</div>
                        ) : todayTasks.length > 0 ? (
                            todayTasks.map(renderTask)
                        ) : (
                            <div className="no-tasks">No tasks for today</div>
                        )}
                    </div>
                </div>
            </div>

            <BottomNav onPlusClick={handleHomePlusClick} />
        </div>
    );
};

const DesktopHomePage: React.FC<HomePageProps> = ({
    totalValue,
    completedValue,
    todayValue,
    weekValue,
    todayTasks,
    isLoadingTasks,
    renderTask,
    handleHomePlusClick
}) => {
    return (
        <div className="home-page desktop">
            <Header />

            <div className="home-page-content">
                <div className="content-grid">
                    {/* Левая колонка - Статистика */}
                    <div className="filters-grid">
                        <h1 className='stat'>Statistics</h1>

                        <div className="filters-row">
                            <FilterTab
                                title="Total"
                                value={totalValue}
                                isActive={false}
                                isDesktop={true}
                            />
                            <FilterTab
                                title="Completed"
                                value={completedValue}
                                isActive={true}
                                isDesktop={true}
                            />
                        </div>

                        <div className="filters-row">
                            <FilterTab
                                title="Today"
                                value={todayValue}
                                isActive={true}
                                isDesktop={true}
                            />
                            <FilterTab
                                title="Week"
                                value={weekValue}
                                isActive={false}
                                isDesktop={true}
                            />
                        </div>
                    </div>

                    {/* Правая колонка - Задачи */}
                    <div className="today-tasks">
                        <div className="tasks-list">
                            <h2 className="section-title">Today's Tasks</h2>
                            
                            {isLoadingTasks ? (
                                <div className="loading">Loading tasks...</div>
                            ) : todayTasks.length > 0 ? (
                                todayTasks.map(renderTask)
                            ) : (
                                <div className="no-tasks">No tasks for today</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <BottomNav onPlusClick={handleHomePlusClick} />
        </div>
    );
};

const HomePage = () => {
    const navigate = useNavigate();
    const isDesktop = useMediaQuery({ minWidth: 768 });
    
    const { tasks, toggleTask, deleteTask, isLoading: isLoadingTasks } = useTasks();
    const { statistics, loadProfile, isLoading: isLoadingUser } = useUser();

    useEffect(() => {
        loadProfile();
    }, []);

    const getStatValue = (label: string): number => {
        const stat = statistics.find(s => s.label === label);
        return stat ? stat.value : 0;
    };

    const handleHomePlusClick = () => {
        navigate('/tasks', {
            state: { shouldOpenCreateModal: true }
        });
    };

    const getLocalDate = (dateString: string): Date => {
        const date = new Date(dateString);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };


    const getTaskLocalDate = (task: Task): Date => {
        if (task.scheduledDate) {
            return getLocalDate(task.scheduledDate);
        }
        return getLocalDate(task.createdAt);
    };

    const today = new Date();
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const getStartOfWeek = (date: Date): Date => {
        const currentDate = new Date(date);
        const day = currentDate.getDay(); 
        const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); 
        const monday = new Date(currentDate.getFullYear(), currentDate.getMonth(), diff);
        return monday;
    };

    const getEndOfWeek = (date: Date): Date => {
        const monday = getStartOfWeek(date);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);
        return sunday;
    };

    const tasksForToday = tasks.filter(task => {
        const taskDate = getTaskLocalDate(task);
        return taskDate.getTime() === todayLocal.getTime();
    });

    const startOfWeekDate = getStartOfWeek(todayLocal);
    const endOfWeekDate = getEndOfWeek(todayLocal);
    
    const tasksForWeek = tasks.filter(task => {
        const taskDate = getTaskLocalDate(task);
        return taskDate >= startOfWeekDate && taskDate <= endOfWeekDate;
    });

    const todayTasksToShow = tasksForToday.slice(0, 3);

    const totalValue = tasks.length;
    const completedValue = tasks.filter(t => t.isCompleted).length;
    const todayValue = tasksForToday.length; 
    const weekValue = tasksForWeek.length; 

    console.log('Сегодняшняя дата (локальная):', {
        date: todayLocal.toISOString().split('T')[0],
        day: todayLocal.getDate(),
        month: todayLocal.getMonth() + 1,
        year: todayLocal.getFullYear(),
        dayOfWeek: todayLocal.getDay()
    });

    console.log('Задачи на сегодня:', tasksForToday.map(t => ({
        id: t.id,
        name: t.name,
        scheduledDate: t.scheduledDate,
        localDate: getTaskLocalDate(t).toISOString().split('T')[0],
        isToday: true
    })));

    console.log('Все задачи:', tasks.map(t => ({
        id: t.id,
        name: t.name,
        scheduledDate: t.scheduledDate,
        localDate: getTaskLocalDate(t).toISOString().split('T')[0],
        createdAt: t.createdAt
    })));

    const renderTask = (task: Task) => {
        const taskName = task.name || 'No name';
        const taskCreatedAt = task.createdAt || new Date().toISOString();
        
        return (
            <TaskItem
                key={task.id}
                id={task.id}
                title={taskName}
                time={formatTaskTime(taskCreatedAt)}
                priority={formatPriority(task.priority)}
                completed={task.isCompleted}
                onCheckboxClick={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
            />
        );
    };

    if (isLoadingUser) {
        return (
            <div className={`home-page ${isDesktop ? 'desktop' : 'mobile'}`}>
                <Header />
                <div className="loading">Loading statistics...</div>
                <BottomNav onPlusClick={handleHomePlusClick} />
            </div>
        );
    }

    if (isDesktop) {
        return <DesktopHomePage 
            totalValue={totalValue}
            completedValue={completedValue}
            todayValue={todayValue}
            weekValue={weekValue}
            todayTasks={todayTasksToShow}
            isLoadingTasks={isLoadingTasks}
            renderTask={renderTask}
            handleHomePlusClick={handleHomePlusClick}
        />;
    }

    return <MobileHomePage 
        totalValue={totalValue}
        completedValue={completedValue}
        todayValue={todayValue}
        weekValue={weekValue}
        todayTasks={todayTasksToShow}
        isLoadingTasks={isLoadingTasks}
        renderTask={renderTask}
        handleHomePlusClick={handleHomePlusClick}
    />;
};

const formatTaskTime = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    } catch {
        return '00:00';
    }
};

const formatPriority = (priority: string): 'High' | 'Medium' | 'Low' => {
    const formatted = priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
    
    if (['High', 'Medium', 'Low'].includes(formatted)) {
        return formatted as 'High' | 'Medium' | 'Low';
    }
    
    return 'Medium';
};

export default HomePage;
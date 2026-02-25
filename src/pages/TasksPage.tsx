import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useMediaQuery } from 'react-responsive';
import Header from '../components/layout/Header';
import DayCard from '../components/calendar/DayCard';
import './TasksPage.css';
import TaskItem from '../components/tasks/TaskItem';
import BottomNav from '../components/layout/BottomNav';
import { useLocation } from 'react-router-dom';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import type { TaskPriority } from '../components/tasks/CreateTaskModal';
import { useTasks } from '../contexts/TasksContext';
import {
  isSameDate,
  isToday,
  getFullDateLabel
} from '../utils/dateUtils';
import DesktopCreateTask from '../components/tasks/DesktopCreateTask';
import ExpandedCalendar from '../components/calendar/ExpandedCalendar';
import DraggableTask from '../components/tasks/DraggableTask';
import DroppableColumn from '../components/calendar/DroppableColumn';
import DroppableDay from '../components/calendar/DroppableDay';
import type { Task } from '../types';

const TasksPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const location = useLocation();
  const [selectedPriority, setSelectedPriority] = useState<'ALL' | 'High' | 'Medium' | 'Low'>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [visibleDays, setVisibleDays] = useState<Date[]>([]);
  const [isExpandedCalendarOpen, setIsExpandedCalendarOpen] = useState(false);
  const [currentDayOffset, setCurrentDayOffset] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const { tasks, toggleTask, addTask, isLoading, deleteTask, changeTaskDate } = useTasks();

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const todayColumnRef = useRef<HTMLDivElement>(null);
  const isDraggingScroll = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    if (location.state?.shouldOpenCreateModal) {
      const timer = setTimeout(() => {
        setIsCreateModalOpen(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);


  useEffect(() => {
    if (!isMobile) {
      const days: Date[] = [];
      const today = new Date();

      for (let i = -14; i <= 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push(date);
      }

      setVisibleDays(days);
      setIsInitialized(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile && scrollContainerRef.current && visibleDays.length > 0 && !isInitialized) {
      const today = new Date();
      const todayIndex = visibleDays.findIndex(date => isSameDate(date, today));
      
      if (todayIndex !== -1) {
        const scrollToToday = () => {
          const container = scrollContainerRef.current;
          if (!container) return;
          
          const columnWidth = 279 + 30; 
          const containerWidth = container.clientWidth;
          const todayPosition = todayIndex * columnWidth;
          const scrollPosition = todayPosition - (containerWidth / 2) + (columnWidth / 2);
          
          container.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
          });
        };
        

        setTimeout(scrollToToday, 300);
        setIsInitialized(true);
      }
    }
  }, [visibleDays, isMobile, isInitialized]);

  const tasksByDate = useMemo(() => {
    const groups: Record<string, { date: Date; tasks: Task[] }> = {};
    
    visibleDays.forEach(date => {
      const dateKey = date.toISOString().split('T')[0];
      groups[dateKey] = {
        date,
        tasks: []
      };
    });
    
    tasks.forEach(task => {
      const taskDate = task.scheduledDate 
        ? new Date(task.scheduledDate)
        : new Date(task.createdAt);
      
      const dateKey = taskDate.toISOString().split('T')[0];
      
      if (groups[dateKey]) {
        groups[dateKey].tasks.push(task);
      }
    });
    
    return groups;
  }, [tasks, visibleDays]);


  const mobileDaysToShow = useMemo(() => {
    if (isMobile) {
      const days: Date[] = [];
      const today = new Date();
      
      const startDate = new Date(today);
      startDate.setDate(today.getDate() + currentDayOffset);
      
      for (let i = 0; i < 5; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        days.push(date);
      }
      
      return days;
    }
    return [];
  }, [isMobile, currentDayOffset]);


  const mobileFilteredTasks = useMemo(() => {
    if (!isMobile) return [];
    
    const priorityFiltered = tasks.filter(task => {
      if (selectedPriority === 'ALL') return true;
      return task.priority === selectedPriority.toLowerCase();
    });

    return priorityFiltered.filter(task => {
      const taskDate = task.scheduledDate 
        ? new Date(task.scheduledDate)
        : new Date(task.createdAt);
      return isSameDate(taskDate, selectedDate);
    });
  }, [tasks, selectedDate, selectedPriority, isMobile]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );


const scrollToDate = useCallback((date: Date) => {
  const container = scrollContainerRef.current;
  if (!container || isMobile) return;
  
  const index = visibleDays.findIndex(d => isSameDate(d, date));
  if (index === -1) return;
  
  // Находим все колонки
  const columns = container.querySelectorAll('.calendar-trello-column-wrapper');
  if (columns.length > index) {
    const targetColumn = columns[index] as HTMLElement;
    
    // Используем scrollIntoView с опциями для центрирования
    targetColumn.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',      // не скроллим по вертикали
      inline: 'center'       // центрируем по горизонтали
    });
  }
}, [visibleDays, isMobile]);


  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container || isMobile) return;
    
    isDraggingScroll.current = true;
    startX.current = e.pageX - container.offsetLeft;
    scrollLeft.current = container.scrollLeft;
    
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    isDraggingScroll.current = false;
    const container = scrollContainerRef.current;
    if (container) {
      container.style.cursor = 'grab';
      container.style.removeProperty('user-select');
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingScroll.current = false;
    const container = scrollContainerRef.current;
    if (container) {
      container.style.cursor = 'grab';
      container.style.removeProperty('user-select');
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingScroll.current || isMobile) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;
    
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX.current) * 1.5; 
    container.scrollLeft = scrollLeft.current - walk;
  }, [isMobile]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault(); 
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (over && over.id.toString().startsWith('column-')) {
      const taskId = active.id.toString();
      const dateStr = over.id.toString().replace('column-', '');
      const newDate = new Date(dateStr);
      changeTaskDate(taskId, newDate);
    }
  };

  const handlePreviousDays = () => {
    if (isMobile) {
      setCurrentDayOffset(prev => prev - 4);
    }
  };

  const handleNextDays = () => {
    if (isMobile) {
      setCurrentDayOffset(prev => prev + 4);
    }
  };

  const handleCreateTaskForDay = (date: Date, taskData: { name: string; priority: TaskPriority }) => {
    addTask({
      name: taskData.name,
      priority: taskData.priority,
      scheduledDate: date.toISOString().split('T')[0]
    });
  };

  const formatPriorityForTaskItem = (priority: TaskPriority): 'High' | 'Medium' | 'Low' => {
    return priority.charAt(0).toUpperCase() + priority.slice(1) as 'High' | 'Medium' | 'Low';
  };

  const formatTaskTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return '--:--';
    }
  };

  const weekRange = useMemo(() => {
    if (isMobile && mobileDaysToShow.length >= 2) {
      const start = mobileDaysToShow[0];
      const end = mobileDaysToShow[4];
      return `${start.getDate()} ${start.toLocaleDateString('en-US', { month: 'short' })} - ${end.getDate()} ${end.toLocaleDateString('en-US', { month: 'short' })}`;
    }
    return '';
  }, [isMobile, mobileDaysToShow]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="tasks-page">
        <Header title="Today's Tasks" showBackButton={true} />

        {/* МОБИЛЬНАЯ ВЕРСИЯ */}
        {isMobile && (
          <>
            <div className="week-navigation">
              <button className="nav-arrow left" onClick={handlePreviousDays}>←</button>
              <div className="week-range" onClick={() => setIsExpandedCalendarOpen(true)}>
                {weekRange}
              </div>
              <button className="nav-arrow right" onClick={handleNextDays}>→</button>
            </div>

            <div className="tasks-content">
              <div className="calendar-days">
                {mobileDaysToShow.map((date) => (
                  <DayCard
                    key={date.toISOString()}
                    date={date}
                    isSelected={isSameDate(date, selectedDate)}
                    onClick={() => setSelectedDate(date)}
                  />
                ))}
              </div>

              <div className="priority-filters">
                <button className={`filter-btn ${selectedPriority === 'ALL' ? 'active' : ''}`} onClick={() => setSelectedPriority('ALL')}>ALL</button>
                <button className={`filter-btn ${selectedPriority === 'High' ? 'active' : ''}`} onClick={() => setSelectedPriority('High')}>High</button>
                <button className={`filter-btn ${selectedPriority === 'Medium' ? 'active' : ''}`} onClick={() => setSelectedPriority('Medium')}>Medium</button>
                <button className={`filter-btn ${selectedPriority === 'Low' ? 'active' : ''}`} onClick={() => setSelectedPriority('Low')}>Low</button>
              </div>

              <div className="tasks-list">
                {isLoading ? <div>Loading...</div> : mobileFilteredTasks.length === 0 ? <div className="no-tasks">No tasks</div> : (
                  mobileFilteredTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      id={task.id}
                      title={task.name}
                      time={formatTaskTime(task.createdAt)}
                      priority={formatPriorityForTaskItem(task.priority)}
                      completed={task.isCompleted}
                      onCheckboxClick={() => toggleTask(task.id)}
                      onDelete={() => deleteTask(task.id)}
                    />
                  ))
                )}
              </div>
            </div>

            <BottomNav onPlusClick={() => setIsCreateModalOpen(true)} />
            <CreateTaskModal 
              isOpen={isCreateModalOpen} 
              onClose={() => setIsCreateModalOpen(false)} 
              onSubmit={(taskData) => handleCreateTaskForDay(selectedDate, taskData)} 
            />
          </>
        )}

        {/* ДЕСКТОПНАЯ ВЕРСИЯ */}
        {!isMobile && (
          <div className="desktop-tasks-page">
            <div className="desktop-divider"></div>

            {/* ОБЪЕДИНЕННЫЙ КАЛЕНДАРЬ И КОЛОНКИ */}
            <div 
              className="combined-calendar-trello"
              ref={scrollContainerRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onWheel={handleWheel}
              style={{ cursor: 'grab' }}
            >
              <div className="calendar-header-scroll">
                {visibleDays.map((date) => {
                  const dateKey = date.toISOString().split('T')[0];
                  const isSelected = isSameDate(date, selectedDate);
                  const isTodayDate = isToday(date);
                  const dayTasks = tasksByDate[dateKey]?.tasks || [];
                  
                  return (
                    <div 
                      key={dateKey} 
                      className="calendar-trello-column-wrapper"
                      ref={isTodayDate ? todayColumnRef : null}
                    >
                      {/* ЗАГОЛОВОК ДНЯ */}
                      <div 
                        className={`calendar-trello-header ${isTodayDate ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedDate(date);
                          scrollToDate(date);
                        }}
                      >
                        <div className="calendar-trello-date">
                          {getFullDateLabel(date)}
                        </div>
                        <div className="calendar-trello-count">
                          {dayTasks.length} задач
                        </div>
                      </div>
                      
                      {/* КОЛОНКА С ЗАДАЧАМИ */}
                      <DroppableColumn 
                        date={date}
                        id={`column-${dateKey}`}
                      >
                        <div className="calendar-trello-column">
                          <SortableContext 
                            items={dayTasks.map(t => t.id)} 
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="calendar-trello-tasks">
                              {dayTasks.map(task => (
                                <DraggableTask
                                  key={task.id}
                                  id={task.id}
                                  title={task.name}
                                  time={formatTaskTime(task.createdAt)}
                                  priority={formatPriorityForTaskItem(task.priority)}
                                  completed={task.isCompleted}
                                  onCheckboxClick={() => toggleTask(task.id)}
                                  onDelete={() => deleteTask(task.id)}
                                />
                              ))}
                            </div>
                          </SortableContext>
                          
                          {/* КНОПКА СОЗДАНИЯ ЗАДАЧИ ВНУТРИ КОЛОНКИ */}
                          <DesktopCreateTask 
                            onSubmit={(taskData) => handleCreateTaskForDay(date, taskData)}
                            compact={true}
                          />
                        </div>
                      </DroppableColumn>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="desktop-bottom-nav">
              <BottomNav onPlusClick={() => {}} />
            </div>
          </div>
        )}

        <DragOverlay>
          {activeTask && (
            <div style={{ 
              
             
              opacity: 0.8,
              width: '279px'
            }}>
              <TaskItem
                id={activeTask.id}
                title={activeTask.name}
                time={formatTaskTime(activeTask.createdAt)}
                priority={formatPriorityForTaskItem(activeTask.priority)}
                completed={activeTask.isCompleted}
                onCheckboxClick={() => {}}
                onDelete={() => {}}
              />
            </div>
          )}
        </DragOverlay>

        {isMobile && isExpandedCalendarOpen && (
          <div className="expanded-calendar-modal">
            <div className="expanded-calendar-overlay" onClick={() => setIsExpandedCalendarOpen(false)}></div>
            <div className="expanded-calendar-content">
              <ExpandedCalendar
                selectedDate={selectedDate}
                onDateSelect={(date) => {
                  setSelectedDate(date);
                  setIsExpandedCalendarOpen(false);
                  const diffTime = date.getTime() - new Date().getTime();
                  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                  const offset = diffDays - (diffDays % 5);
                  setCurrentDayOffset(offset);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </DndContext>
  );
};

export default TasksPage;
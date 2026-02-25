import React, { useState } from 'react';
import './DesktopCreateTask.css';
import type { TaskPriority } from './CreateTaskModal';

interface DesktopCreateTaskProps {
  onSubmit: (task: { name: string; priority: TaskPriority }) => void;
  compact?: boolean;
}

const DesktopCreateTask: React.FC<DesktopCreateTaskProps> = ({ onSubmit }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');

  const handleSubmit = () => {
    if (!taskName.trim()) return;
    
    onSubmit({
      name: taskName.trim(),
      priority
    });
    

    setTaskName('');
    setPriority('medium');
    setIsCreating(false);
  };

  const handleCancel = () => {
    setTaskName('');
    setPriority('medium');
    setIsCreating(false);
  };

  if (!isCreating) {
    return (
      <button 
        className="desktop-create-btn"
        onClick={() => setIsCreating(true)}
      >
        Create Task
      </button>
    );
  }

  return (
    <div className="desktop-task-form">
      <div className="desktop-form-header">
        <div className="desktop-form-title">New Task</div>
        <button className="desktop-close-btn" onClick={handleCancel}>×</button>
      </div>
      
      <div className="desktop-form-content">
        <div className="desktop-form-group">
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Task name"
            className="desktop-name-input"
            autoFocus
          />
        </div>
        
        <div className="desktop-form-group">
          <div className="desktop-priority-label">Priority</div>
          <div className="desktop-priority-buttons">
            <button
              type="button"
              className={`desktop-priority-btn high ${priority === 'high' ? 'active' : ''}`}
              onClick={() => setPriority('high')}
            >
              High
            </button>
            <button
              type="button"
              className={`desktop-priority-btn medium ${priority === 'medium' ? 'active' : ''}`}
              onClick={() => setPriority('medium')}
            >
              Medium
            </button>
            <button
              type="button"
              className={`desktop-priority-btn low ${priority === 'low' ? 'active' : ''}`}
              onClick={() => setPriority('low')}
            >
              Low
            </button>
          </div>
        </div>
      </div>
      
      <div className="desktop-form-actions">
        <button
          className="desktop-submit-icon-btn"
          onClick={handleSubmit}
          disabled={!taskName.trim()}
        >
          <svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.46212 13C5.00036 13 4.5386 12.8345 4.17405 12.4798L0.528592 8.93269C-0.176197 8.24693 -0.176197 7.11187 0.528592 6.4261C1.23338 5.74034 2.39993 5.74034 3.10472 6.4261L5.46212 8.71987L13.8953 0.514325C14.6001 -0.171442 15.7666 -0.171442 16.4714 0.514325C17.1762 1.20009 17.1762 2.33515 16.4714 3.02092L6.75018 12.4798C6.40994 12.8345 5.92388 13 5.46212 13Z" fill="#5F33E1"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DesktopCreateTask;
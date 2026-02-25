import React, { useState } from 'react';
import './TaskItem.css';
import DeleteTaskModal from './DeleteTaskModal';

export interface TaskItemProps {
    id: string; 
    title: string;
    time: string;
    priority: 'High' | 'Medium' | 'Low';
    completed: boolean;
    onCheckboxClick: () => void;
    onDelete?: (taskId: string) => void; 
    className?: string;
}

const TaskItem = ({
    id,
    title,
    time,
    priority,
    completed,
    onCheckboxClick,
    onDelete
}: TaskItemProps) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleTaskClick = (e: React.MouseEvent) => {
       
        if ((e.target as HTMLElement).closest('.task-checkbox')) {
            e.preventDefault(); 
            e.stopPropagation(); 
            return; 
        }
        if (onDelete) {
            setIsDeleteModalOpen(true);
        }
    };

    const handleDeleteConfirm = () => {
        if (onDelete) {
            onDelete(id);
        }
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            <div
                className={`task-item ${completed ? 'completed' : ''}`}
                onClick={handleTaskClick}
                style={{ cursor: onDelete ? 'pointer' : 'default', zIndex: 1, position: 'relative' }}
            >
                <div className="task-content">
                    <div className="task-title">{title}</div>
                    <div className="task-time">
                        <div className="time-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                            </svg>
                        </div>
                        <span className="time-text">{time}</span>
                    </div>
                </div>
                <div className="task-right">
                    <div
                        className={`task-checkbox ${completed ? 'checked' : ''}`}
                        onClick={onCheckboxClick}
                    >
                        {completed && '✓'}
                    </div>
                    <div className={`task-priority ${priority.toLowerCase()}`}>
                        {priority}
                    </div>
                </div>
            </div>

            <DeleteTaskModal
                isOpen={isDeleteModalOpen}
                taskTitle={title}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
};

export default TaskItem;
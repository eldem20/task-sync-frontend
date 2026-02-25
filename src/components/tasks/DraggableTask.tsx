import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import TaskItem, { type TaskItemProps } from './TaskItem';

interface DraggableTaskProps extends TaskItemProps {
  id: string;
}

const DraggableTask: React.FC<DraggableTaskProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: props.id,
  });

  const style: React.CSSProperties = {
   
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 1000 : 1,
    transition: isDragging ? 'opacity 0.1s ease' : 'transform 0.2s ease, opacity 0.2s ease',
    visibility: isDragging ? 'hidden' : 'visible' as 'hidden' | 'visible',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`draggable-task ${isDragging ? 'dragging' : ''}`}
    
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('.task-checkbox-container') || 
            target.closest('.task-checkbox') || 
            target.closest('.delete-button')) {
          e.stopPropagation();
          return;
        }
      }}
    >
      <TaskItem {...props} />
    </div>
  );
};

export default DraggableTask;
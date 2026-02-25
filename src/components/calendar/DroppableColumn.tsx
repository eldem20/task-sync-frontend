import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableColumnProps {
  date: Date;
  id: string;
  children: React.ReactNode;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ date, id, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'column',
      date
    }
  });

  return (
    <div 
      ref={setNodeRef}
      className={`droppable-column ${isOver ? 'drag-over' : ''}`}
      style={{ minHeight: '100px' }}
    >
      {children}
    </div>
  );
};

export default DroppableColumn;
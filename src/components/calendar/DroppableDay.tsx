import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableDayProps {
  date: Date;
  children: React.ReactNode;
}

const DroppableDay: React.FC<DroppableDayProps> = ({ date, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `day-${date.toISOString()}`,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`droppable-day ${isOver ? 'drag-over' : ''}`}
      data-date={date.toISOString()}
      style={{
        position: 'relative',
        borderRadius: '10px',
        minHeight: '100%'
      }}
    >
      {isOver && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: '2px dashed #5F33E1',
            borderRadius: '10px',
            backgroundColor: 'rgba(95, 51, 225, 0.1)',
            zIndex: 10
          }}
        />
      )}
      {children}
    </div>
  );
};

export default DroppableDay;
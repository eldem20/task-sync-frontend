import React, { useState } from 'react';
import './ExpandedCalendar.css';
import { isSameDate, getMonthDays } from '../../utils/dateUtils';

interface ExpandedCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const ExpandedCalendar: React.FC<ExpandedCalendarProps> = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const handlePreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateSelect(today);
  };

  const days = getMonthDays(currentMonth);
  const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const monthName = currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="expanded-calendar">
      <div className="expanded-calendar-header">
        <button className="nav-btn" onClick={handlePreviousMonth}>←</button>
        <div className="month-name">{monthName}</div>
        <button className="nav-btn" onClick={handleNextMonth}>→</button>
      </div>
      
      <div className="expanded-calendar-grid">
        {weekdays.map(day => (
          <div key={day} className="weekday-header">{day}</div>
        ))}
        
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const isSelected = isSameDate(date, selectedDate);
          const isTodayDate = isSameDate(date, new Date());
          
          return (
            <div
              key={index}
              className={`month-day 
                ${!isCurrentMonth ? 'other-month' : ''} 
                ${isSelected ? 'selected' : ''}
                ${isTodayDate ? 'today' : ''}`}
              onClick={() => {
                // ПЕРЕДАЕМ ВЫБРАННУЮ ДАТУ НАРУЖУ
                onDateSelect(date);
              }}
            >
              <span className="day-number">{date.getDate()}</span>
            </div>
          );
        })}
      </div>
      
      <button className="today-btn" onClick={handleToday}>
        Today
      </button>
    </div>
  );
};

export default ExpandedCalendar;
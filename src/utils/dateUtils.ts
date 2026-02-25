// src/utils/dateUtils.ts
/**
 * Получить 7 дней недели (пн-вс)
 * @param weekOffset Смещение в неделях (0 - текущая неделя, -1 - предыдущая и т.д.)
 */

export const getFiveDaysFromDate = (startDate: Date): Date[] => {
  const days: Date[] = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < 5; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    days.push(date);
  }
  
  return days;
};

export const getWeekDays = (weekOffset: number = 0): Date[] => {
  const days: Date[] = [];
  const today = new Date();
  
  const monday = new Date(today);
  const dayOfWeek = monday.getDay();
  
  let diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(monday.getDate() + diff + (weekOffset * 7));
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    days.push(date);
  }
  
  return days;
};

export const formatWeekRange = (days: Date[]): string => {
  if (days.length === 0) return '';
  
  const start = days[0];
  const end = days[days.length - 1];
  
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()}-${end.getDate()} ${start.toLocaleDateString('en-US', { month: 'short' })}`;
  }
  
  return `${start.getDate()} ${start.toLocaleDateString('en-US', { month: 'short' })} - ${end.getDate()} ${end.toLocaleDateString('en-US', { month: 'short' })}`;
};

export const isSameDate = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return isSameDate(date, today);
};

export const getMonthDays = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const days: Date[] = [];
  
  const firstDayOfWeek = firstDay.getDay() || 7;
  for (let i = firstDayOfWeek - 2; i >= 0; i--) {
    const prevDate = new Date(firstDay);
    prevDate.setDate(firstDay.getDate() - (i + 1));
    days.push(prevDate);
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  const totalCells = 42;
  const daysNeeded = totalCells - days.length;
  for (let i = 1; i <= daysNeeded; i++) {
    days.push(new Date(year, month + 1, i));
  }
  
  return days;
};

export const getMonday = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

// src/utils/dateUtils.ts - ДОБАВЛЯЕМ
/**
 * Форматировать дату для заголовка дня "24 May - Today"
 */
export const formatDateForDayHeader = (date: Date): string => {
  const today = new Date();
  const isTodayDate = isSameDate(date, today);
  
  const dateStr = `${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
  
  return isTodayDate ? `${dateStr} - Today` : dateStr;
};

// src/utils/dateUtils.ts - ДОБАВЛЯЕМ ФУНКЦИЮ
/**
 * Форматировать дату для горизонтального календаря "24 May - Today" или "25 May"
 */
export const getDateLabel = (date: Date): string => {
  const today = new Date();
  const isTodayDate = isSameDate(date, today);
  
  const dateStr = `${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
  
  return isTodayDate ? `${dateStr} - Today` : dateStr;
};


export const getNextFiveDays = (startDate: Date = new Date()): Date[] => {
  const days: Date[] = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < 5; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    days.push(date);
  }
  
  return days;
};

// dateUtils.ts - добавьте эту функцию
// dateUtils.ts - добавьте эту функцию
export const getFullDateLabel = (date: Date): string => {
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  return `${day} ${month} - ${weekday}`;
};
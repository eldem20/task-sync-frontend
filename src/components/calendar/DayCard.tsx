import './DayCard.css';

interface DayCardProps {
  date: Date; 
  isSelected: boolean; 
  onClick: () => void; 
}

const DayCard = ({ date, isSelected, onClick }: DayCardProps) => {
    const number = date.getDate()
    const month = date.toLocaleString('en-US', { month: 'short' })
    const weekday = date.toLocaleString('en-US', { weekday: 'short' })

  
  return (
    <div 
      className={`day-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="day-number">{month}</div>
      <div className="day-month">{number}</div>
      <div className="day-weekday">{weekday}</div>
    </div>
  );
};

export default DayCard 
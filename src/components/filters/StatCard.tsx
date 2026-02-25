import './StatCard.css';

interface FilterTabProps {
    title: string;  
    value: number;  
    isActive?: boolean;
    isDesktop?: boolean; 
}

const FilterTab = ({ 
    title, 
    value, 
    isActive = false, 
    isDesktop = false 
}: FilterTabProps) => {
    return (
        <div className={`filter-tab ${isActive ? 'active' : ''} ${isDesktop ? 'desktop' : ''}`}>
            <div className="filter-title">{title}</div>
            <div className="filter-value">{value}</div>
        </div>
    );
};

export default FilterTab;
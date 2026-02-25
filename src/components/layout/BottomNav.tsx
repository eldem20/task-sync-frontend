import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import './BottomNav.css';
import { useMediaQuery } from 'react-responsive';

interface BottomNavProps {
    onPlusClick?: () => void;
    plusIcon?: 'plus' | 'play' | 'pause' | 'save' | 'close'; 
}

const BottomNav = ({ onPlusClick, plusIcon = 'plus' }: BottomNavProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isDesktop = useMediaQuery({ minWidth: 768 });


    const navItems = [
        {
            id: 'home',
            path: '/home',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.83 8.00999L14.28 2.76999C13 1.74999 11 1.74999 9.73 2.75999L3.18 8.00999C2.24 8.75999 1.67 10.26 1.87 11.44L3.13 18.98C3.42 20.67 4.99 22 6.7 22H17.3C18.99 22 20.59 20.64 20.88 18.97L22.14 11.43C22.32 10.26 21.75 8.75999 20.83 8.00999ZM12.75 18C12.75 18.41 12.41 18.75 12 18.75C11.59 18.75 11.25 18.41 11.25 18V15C11.25 14.59 11.59 14.25 12 14.25C12.41 14.25 12.75 14.59 12.75 15V18Z" fill="currentColor" />
                </svg>
            )
        },
        {
            id: 'calendar',
            path: '/tasks',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.75 3.56V2C16.75 1.59 16.41 1.25 16 1.25C15.59 1.25 15.25 1.59 15.25 2V3.5H8.75V2C8.75 1.59 8.41 1.25 8 1.25C7.59 1.25 7.25 1.59 7.25 2V3.56C4.55 3.81 3.24 5.42 3.04 7.81C3.02 8.1 3.26 8.34 3.54 8.34H20.46C20.75 8.34 20.99 8.09 20.96 7.81C20.76 5.42 19.45 3.81 16.75 3.56Z" fill="currentColor" />
                    <path opacity="0.4" d="M20 9.84C20.55 9.84 21 10.29 21 10.84V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V10.84C3 10.29 3.45 9.84 4 9.84H20Z" fill="currentColor" />
                    <path d="M8.5 15C8.24 15 7.98 14.89 7.79 14.71C7.61 14.52 7.5 14.26 7.5 14C7.5 13.74 7.61 13.48 7.79 13.29C8.07 13.01 8.51 12.92 8.88 13.08C9.01 13.13 9.12 13.2 9.21 13.29C9.39 13.48 9.5 13.74 9.5 14C9.5 14.26 9.39 14.52 9.21 14.71C9.02 14.89 8.76 15 8.5 15Z" fill="currentColor" />
                    <path d="M12 15C11.74 15 11.48 14.89 11.29 14.71C11.11 14.52 11 14.26 11 14C11 13.74 11.11 13.48 11.29 13.29C11.38 13.2 11.49 13.13 11.62 13.08C11.99 12.92 12.43 13.01 12.71 13.29C12.89 13.48 13 13.74 13 14C13 14.26 12.89 14.52 12.71 14.71C12.66 14.75 12.61 14.79 12.56 14.83C12.5 14.87 12.44 14.9 12.38 14.92C12.32 14.95 12.26 14.97 12.2 14.98C12.13 14.99 12.07 15 12 15Z" fill="currentColor" />
                    <path d="M15.5 15C15.24 15 14.98 14.89 14.79 14.71C14.61 14.52 14.5 14.26 14.5 14C14.5 13.74 14.61 13.48 14.79 13.29C14.89 13.2 14.99 13.13 15.12 13.08C15.3 13 15.5 12.98 15.7 13.02C15.76 13.03 15.82 13.05 15.88 13.08C15.94 13.1 16 13.13 16.06 13.17C16.11 13.21 16.16 13.25 16.21 13.29C16.39 13.48 16.5 13.74 16.5 14C16.5 14.26 16.39 14.52 16.21 14.71C16.16 14.75 16.11 14.79 16.06 14.83C16 14.87 15.94 14.9 15.88 14.92C15.82 14.95 15.76 14.97 15.7 14.98C15.63 14.99 15.56 15 15.5 15Z" fill="currentColor" />
                    <path d="M8.5 18.5C8.37 18.5 8.24 18.47 8.12 18.42C7.99 18.37 7.89 18.3 7.79 18.21C7.61 18.02 7.5 17.76 7.5 17.5C7.5 17.24 7.61 16.98 7.79 16.79C7.89 16.7 7.99 16.63 8.12 16.58C8.3 16.5 8.5 16.48 8.7 16.52C8.76 16.53 8.82 16.55 8.88 16.58C8.94 16.6 9 16.63 9.06 16.67C9.11 16.71 9.16 16.75 9.21 16.79C9.39 16.98 9.5 17.24 9.5 17.5C9.5 17.76 9.39 18.02 9.21 18.21C9.16 18.25 9.11 18.3 9.06 18.33C9 18.37 8.94 18.4 8.88 18.42C8.82 18.45 8.76 18.47 8.7 18.48C8.63 18.49 8.57 18.5 8.5 18.5Z" fill="currentColor" />
                    <path d="M12 18.5C11.74 18.5 11.48 18.39 11.29 18.21C11.11 18.02 11 17.76 11 17.5C11 17.24 11.11 16.98 11.29 16.79C11.66 16.42 12.34 16.42 12.71 16.79C12.89 16.98 13 17.24 13 17.5C13 17.76 12.89 18.02 12.71 18.21C12.52 18.39 12.26 18.5 12 18.5Z" fill="currentColor" />
                    <path d="M15.5 18.5C15.24 18.5 14.98 18.39 14.79 18.21C14.61 18.02 14.5 17.76 14.5 17.5C14.5 17.24 14.61 16.98 14.79 16.79C15.16 16.42 15.84 16.42 16.21 16.79C16.39 16.98 16.5 17.24 16.5 17.5C16.5 17.76 16.39 18.02 16.21 18.21C16.02 18.39 15.76 18.5 15.5 18.5Z" fill="currentColor" />
                </svg>
            )
        },
        {
            id: 'list',
            path: '/time-blocks',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.4" d="M20.5 10.19H17.61C15.24 10.19 13.31 8.26 13.31 5.89V3C13.31 2.45 12.86 2 12.31 2H8.07C4.99 2 2.5 4 2.5 7.57V16.43C2.5 20 4.99 22 8.07 22H15.93C19.01 22 21.5 20 21.5 16.43V11.19C21.5 10.64 21.05 10.19 20.5 10.19Z" fill="currentColor" />
                    <path d="M15.8 2.20999C15.39 1.79999 14.68 2.07999 14.68 2.64999V6.13999C14.68 7.59999 15.92 8.80999 17.43 8.80999C18.38 8.81999 19.7 8.81999 20.83 8.81999C21.4 8.81999 21.7 8.14999 21.3 7.74999C19.86 6.29999 17.28 3.68999 15.8 2.20999Z" fill="currentColor" />
                    <path d="M13.5 13.75H7.5C7.09 13.75 6.75 13.41 6.75 13C6.75 12.59 7.09 12.25 7.5 12.25H13.5C13.91 12.25 14.25 12.59 14.25 13C14.25 13.41 13.91 13.75 13.5 13.75Z" fill="currentColor" />
                    <path d="M11.5 17.75H7.5C7.09 17.75 6.75 17.41 6.75 17C6.75 16.59 7.09 16.25 7.5 16.25H11.5C11.91 16.25 12.25 16.59 12.25 17C12.25 17.41 11.91 17.75 11.5 17.75Z" fill="currentColor" />
                </svg>
            )
        },
        {
            id: 'people',
            path: '/menu',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.4" d="M9 2C6.38 2 4.25 4.13 4.25 6.75C4.25 9.32 6.26 11.4 8.88 11.49C8.96 11.48 9.04 11.48 9.1 11.49C9.12 11.49 9.13 11.49 9.15 11.49C9.16 11.49 9.16 11.49 9.17 11.49C11.73 11.4 13.74 9.32 13.75 6.75C13.75 4.13 11.62 2 9 2Z" fill="currentColor" />
                    <path d="M14.08 14.15C11.29 12.29 6.74001 12.29 3.93001 14.15C2.66001 15 1.96001 16.15 1.96001 17.38C1.96001 18.61 2.66001 19.75 3.92001 20.59C5.32001 21.53 7.16001 22 9.00001 22C10.84 22 12.68 21.53 14.08 20.59C15.34 19.74 16.04 18.6 16.04 17.36C16.03 16.13 15.34 14.99 14.08 14.15Z" fill="currentColor" />
                    <path opacity="0.4" d="M19.99 7.34001C20.15 9.28001 18.77 10.98 16.86 11.21C16.85 11.21 16.85 11.21 16.84 11.21H16.81C16.75 11.21 16.69 11.21 16.64 11.23C15.67 11.28 14.78 10.97 14.11 10.4C15.14 9.48001 15.73 8.10001 15.61 6.60001C15.54 5.79001 15.26 5.05001 14.84 4.42001C15.22 4.23001 15.66 4.11001 16.11 4.07001C18.07 3.90001 19.82 5.36001 19.99 7.34001Z" fill="currentColor" />
                    <path d="M21.99 16.59C21.91 17.56 21.29 18.4 20.25 18.97C19.25 19.52 17.99 19.78 16.74 19.75C17.46 19.1 17.88 18.29 17.96 17.43C18.06 16.19 17.47 15 16.29 14.05C15.62 13.52 14.84 13.1 13.99 12.79C16.2 12.15 18.98 12.58 20.69 13.96C21.61 14.7 22.08 15.63 21.99 16.59Z" fill="currentColor" />
                </svg>
            )
        }
    ];

    const handlePlusClick = () => {
        if (onPlusClick) {
            onPlusClick();
            return;
        }

        if (location.pathname === '/home') {
            navigate('/tasks');
        } else if (location.pathname === '/tasks') {

        } else if (location.pathname === '/menu') {
 
        }
    };


    if (isDesktop) {
        return (
            <nav className="bottom-nav-desktop">
                {navItems.map(item => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item-desktop ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className="nav-icon-desktop">
                            {item.icon}
                        </span>
                    </NavLink>
                ))}
            </nav>
        );
    }


    const leftNavItems = navItems.slice(0, 2);
    const rightNavItems = navItems.slice(2, 4);

    return (
        <nav className="bottom-nav">
            {/* Левая группа кнопок */}
            <div className="nav-left">
                {leftNavItems.map(item => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className="nav-icon">
                            {item.icon}
                        </span>
                    </NavLink>
                ))}
            </div>

            {/* Правая группа кнопок */}
            <div className="nav-right">
                {rightNavItems.map(item => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className="nav-icon">
                            {item.icon}
                        </span>
                    </NavLink>
                ))}
            </div>

            {/* Центральная кнопка + (только для мобильной версии) */}
            <button
                className="nav-plus"
                onClick={handlePlusClick}
            >
                <span className="plus-icon">
                    {plusIcon === 'play' ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 12V8.43999C4 4.01999 7.13 2.20999 10.96 4.41999L14.05 6.19999L17.14 7.97999C20.97 10.19 20.97 13.81 17.14 16.02L14.05 17.8L10.96 19.58C7.13 21.79 4 19.98 4 15.56V12Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    ) : plusIcon === 'pause' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="24" height="24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                        </svg>
                    ) : plusIcon === 'save' ? (
                        <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.14082 13C4.70622 13 4.27162 12.8345 3.92852 12.4798L0.497498 8.93269C-0.165833 8.24693 -0.165833 7.11187 0.497498 6.4261C1.16083 5.74034 2.25876 5.74034 2.92209 6.4261L5.14082 8.71987L13.0779 0.514325C13.7412 -0.171442 14.8392 -0.171442 15.5025 0.514325C16.1658 1.20009 16.1658 2.33515 15.5025 3.02092L6.35311 12.4798C6.03288 12.8345 5.57541 13 5.14082 13Z" fill="white" />
                        </svg>
                    ) : plusIcon === 'close' ? (
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.8492 24.7487L24.7487 14.8492" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M24.7487 24.7487L14.8492 14.8493" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    ) : (
                        '+'
                    )}
                </span>
            </button>
        </nav>
    );
};

export default BottomNav;
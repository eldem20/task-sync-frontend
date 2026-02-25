import React from 'react';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import { useUser } from '../hooks/useUser';
import { usePomodoroTimer } from '../hooks/usePomodoroTime';
import './TimerPage.css';
import { useMediaQuery } from 'react-responsive';

const TimerPage: React.FC = () => {
  const { settings } = useUser();
  const isDesktop = useMediaQuery({ minWidth: 768 });

  if (!settings) {
    return (
      <div className="timer-page">
        <Header title="Pomodoro" showBackButton />
        <div className="loading">Загрузка настроек...</div>
      </div>
    );
  }

  const WORK_SECONDS = settings.workInterval * 60;
  const BREAK_SECONDS = settings.breakInterval * 60;
  const TOTAL_INTERVALS = settings.intervalsCount;

  const {
    isLoading,
    formattedTime,
    isRunning,
    isBreak,
    completedRounds,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
    getSquareStatus
  } = usePomodoroTimer(WORK_SECONDS, BREAK_SECONDS);

  const RADIUS = 45;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const strokeOffset = CIRCUMFERENCE * (1 - progress);
  const circleColor = isBreak ? '#4CAF50' : '#F478B8';

  const renderSquares = () => {
    const squares = [];

    for (let i = 0; i < TOTAL_INTERVALS; i++) {
      const status = getSquareStatus(i);
      let className = 'square-box';

      if (status === 'completed') {
        className += ' completed';
      } else if (status === 'active') {
        className += ' active';
      } else {
        className += ' empty';
      }

      squares.push(
        <div key={i} className={className}>
          {status === 'active' && !isBreak && (
            <div
              className="square-fill"
              style={{
                height: `${progress * 100}%`,
                backgroundColor: circleColor
              }}
            />
          )}
          {status === 'active' && isBreak && (
            <div
              className="square-fill"
              style={{
                height: '100%',
                backgroundColor: '#4CAF50'
              }}
            />
          )}
        </div>
      );
    }

    return squares;
  };

  if (isLoading) {
    return (
      <div className="timer-page">
        <Header title="Pomodoro" showBackButton />
        <div className="loading">Загрузка таймера...</div>
      </div>
    );
  }

  return (
    <div className="timer-page">
      <Header title="Pomodoro" showBackButton />

      <div className="timer-container">
        {/* Круговой таймер */}
        <div className="circle-timer">
          <div className="circle-outer">
            <svg
              className="circle-progress-svg"
              viewBox="0 0 100 100"
              style={{ transform: 'rotate(-90deg)' }}
            >
              <circle
                cx="50"
                cy="50"
                r={RADIUS}
                fill="none"
                stroke="#FFE4F2"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r={RADIUS}
                fill="none"
                stroke={circleColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeOffset}
              />
            </svg>

            <div className="time-display-circle">
              <div className="time-text2">
                {formattedTime}
              </div>
            </div>
          </div>
        </div>

        {/* Квадратики прогресса */}
        <div className="squares-container">
          <div className="squares-grid">
            {renderSquares()}
          </div>

          <button className="reset-button" onClick={resetTimer} title="Сбросить таймер">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="28" height="28">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>
      </div>

      <BottomNav
        plusIcon={isRunning ? 'pause' : 'play'}
        onPlusClick={isRunning ? pauseTimer : startTimer}
      />

      {isDesktop && (
        <button
          className="desktop-timer-control-btn"
          onClick={isRunning ? pauseTimer : startTimer}
        >
          <span className="desktop-timer-icon">
            {isRunning ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="28" height="28">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12V8.43999C4 4.01999 7.13 2.20999 10.96 4.41999L14.05 6.19999L17.14 7.97999C20.97 10.19 20.97 13.81 17.14 16.02L14.05 17.8L10.96 19.58C7.13 21.79 4 19.98 4 15.56V12Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
        </button>
      )}
    </div>
  );
};

export default TimerPage; 
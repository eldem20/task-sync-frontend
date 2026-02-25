import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import './SettingsPage.css';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../hooks/useAuth';
import { useMediaQuery } from 'react-responsive';
import LogoutConfirmModal from '../components/calendar/LogoutConfirmModal';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth(); 
  const { settings, updateSettings } = useUser();
  const isDesktop = useMediaQuery({ minWidth: 768 });

  // Состояние для модального окна подтверждения выхода
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [profile, setProfile] = useState({
    email: user?.email || '',
    name: user?.name || '',
    password: ''
  });

  const [pomodoroValues, setPomodoroValues] = useState({
    workInterval: '',
    breakInterval: '',
    intervalCount: ''
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDesktop && e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDesktop, profile, pomodoroValues, settings, user]);

  useEffect(() => {
    setPomodoroValues({
      workInterval: settings.workInterval.toString(),
      breakInterval: settings.breakInterval.toString(),
      intervalCount: settings.intervalsCount.toString()
    });
  }, [settings]);

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePomodoroChange = (field: string, value: string) => {
    setPomodoroValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const newSettings = {
      workInterval: parseInt(pomodoroValues.workInterval) || settings.workInterval,
      breakInterval: parseInt(pomodoroValues.breakInterval) || settings.breakInterval,
      intervalsCount: parseInt(pomodoroValues.intervalCount) || settings.intervalsCount
    };

    updateSettings(newSettings);

    if (profile.name !== user?.name || profile.email !== user?.email) {
      updateUser({
        name: profile.name,
        email: profile.email
      });
    }
  };

  // Обработчик клика на кнопку Logout - открывает модалку
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  // Обработчик подтверждения выхода
  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    logout();
    navigate('/auth');
  };

  // Обработчик отмены выхода
  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (isDesktop && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="settings-page">
      <Header
        title="Settings"
        showBackButton={true}
      />

      <div className="settings-content">
        {/* Подсказка для десктопа */}
        {isDesktop && (
          <div className="desktop-save-hint">
            Нажмите Enter для сохранения
          </div>
        )}

        <section className="settings-section">
          <h2 className="section-title">Profile</h2>

          <div className="fields-grid">
            <div className="column-left">
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="settings-input"
                placeholder="Email"
                onKeyDown={handleInputKeyDown}
              />
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                className="settings-input"
                placeholder="Name"
                onKeyDown={handleInputKeyDown}
              />
            </div>

            <div className="column-right">
              <input
                type="password"
                value={profile.password}
                onChange={(e) => handleProfileChange('password', e.target.value)}
                className="settings-input"
                placeholder="Password"
                onKeyDown={handleInputKeyDown}
              />
              <div className="empty-input-space"></div>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2 className="section-title">Pomodoro</h2>

          <div className="fields-grid">
            <div className="column-left">
              <input
                type="number"
                value={pomodoroValues.workInterval}
                onChange={(e) => handlePomodoroChange('workInterval', e.target.value)}
                className="settings-input"
                placeholder="Work Interval"
                min="1"
                onKeyDown={handleInputKeyDown}
              />
              <input
                type="number"
                value={pomodoroValues.breakInterval}
                onChange={(e) => handlePomodoroChange('breakInterval', e.target.value)}
                className="settings-input"
                placeholder="Break Interval"
                min="1"
                onKeyDown={handleInputKeyDown}
              />
            </div>

            <div className="column-right">
              <input
                type="number"
                value={pomodoroValues.intervalCount}
                onChange={(e) => handlePomodoroChange('intervalCount', e.target.value)}
                className="settings-input"
                placeholder="Interval Count"
                min="1"
                max="10"
                onKeyDown={handleInputKeyDown}
              />
              <div className="empty-input-space"></div>
            </div>
          </div>
        </section>

        {/* Кнопка Logout */}
        <section className="settings-section">
          <div className="logout-section">
            <button 
              className="logout-button"
              onClick={handleLogoutClick}  // ← ИЗМЕНЕНО: теперь открывает модалку
            >
              Logout
            </button>
          </div>
        </section>
      </div>

      {/* Модальное окно подтверждения выхода */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />

      {/* На мобилке показываем BottomNav с иконкой save */}
      {isDesktop ? (
        <BottomNav onPlusClick={() => navigate(-1)} />
      ) : (
        <BottomNav
          onPlusClick={handleSave}
          plusIcon="save"
        />
      )}
    </div>
  );
};

export default SettingsPage;
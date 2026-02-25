
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TasksProvider } from './contexts/TasksContext';
import { UserProvider } from './contexts/UserContext';
import ProtectedRoute from './components/auth/ProtectedRoute'; // Импортируем
import WelcomePage from './pages/WelcomePage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import TimeBlocksPage from './pages/TimeBlocksPage';
import MenuPage from './pages/MenuPage';
import SettingsPage from './pages/SettingPage';
import TimerPage from './pages/TimerPage';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
              <TasksProvider>
                
        <Router>
          <Routes>
            
            <Route path="/" element={<WelcomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Защищенные роуты */}
            <Route path="/home" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            
            <Route path="/tasks" element={
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            } />
            
            <Route path="/time-blocks" element={
              <ProtectedRoute>
                <TimeBlocksPage />
              </ProtectedRoute>
            } />
            
            <Route path="/menu" element={
              <ProtectedRoute>
                <MenuPage />
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/timer" element={
              <ProtectedRoute>
                <TimerPage />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
       
      </TasksProvider>
      </UserProvider>

    </AuthProvider>
  );
}

export default App;
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('ProtectedRoute:', { isLoading, isAuthenticated }); 

  // Если все еще загружается - показываем загрузку
  if (isLoading) {
    console.log('ProtectedRoute: показываем загрузку');
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  // Если не аутентифицирован - редирект на страницу авторизации
  if (!isAuthenticated) {
    console.log('ProtectedRoute: не аутентифицирован, редирект на /auth');
    return <Navigate to="/auth" replace />;
  }

  console.log('ProtectedRoute: доступ разрешен');
  return <>{children}</>;
};

export default ProtectedRoute;
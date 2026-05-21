import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth/AuthPage';
import MainPage from './pages/MainPage';
import GoogleCallback from './pages/Auth/GoogleCallback';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('googleAccessToken');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Страница авторизации */}
        <Route 
          path="/auth" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage onLoginSuccess={handleLoginSuccess} />} 
        />

        {/* Главная страница (Защищенный роут) */}
        <Route 
          path="/" 
          element={isAuthenticated ? <MainPage onLogout={handleLogout} /> : <Navigate to="/auth" replace />} 
        />

        {/* Изменили путь под новый флоу бэкендера (/google/callback) */}
        <Route 
          path="/google/callback" 
          element={<GoogleCallback onLoginSuccess={handleLoginSuccess} />} 
        />

        {/* Если бэкендер перенаправит на /dashboard, показываем ту же Главную страницу или твой дашборд */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <MainPage onLogout={handleLogout} /> : <Navigate to="/auth" replace />} 
        />

        {/* Глобальный редирект */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
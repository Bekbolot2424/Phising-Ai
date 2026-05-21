import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Добавляем пропс onLoginSuccess в аргументы, точно так же как в AuthPage
export default function GoogleCallback({ onLoginSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');

      if (!code) {
        console.error("Код авторизации не найден в URL");
        navigate('/auth');
        return;
      }

      try {
        const response = await axios.post('https://cybersecurityai.onrender.com/api/v1/users/google_login/', { code });
        console.log("Ответ бэкенда при входе:", response.data);

        const appAccessToken = response.data.access || response.data.access_token;
        const appRefreshToken = response.data.refresh || response.data.refresh_token;
        const googleAccessToken = response.data.google_access_token || response.data.google_token;

        if (appAccessToken) localStorage.setItem('accessToken', appAccessToken);
        if (appRefreshToken) localStorage.setItem('refreshToken', appRefreshToken);
        
        if (googleAccessToken) {
          localStorage.setItem('googleAccessToken', googleAccessToken);
          
          // ФИКС: Оповещаем корневой App.jsx, что вход выполнен успешно
          if (onLoginSuccess) {
            onLoginSuccess();
          }
          
          navigate('/');
        } else {
          console.error("Бэкенд не вернул google_access_token.", response.data);
          navigate('/auth');
        }

      } catch (error) {
        console.error("Ошибка при обмене кода на токены:", error);
        navigate('/auth');
      }
    };

    handleCallback();
  }, [location, navigate, onLoginSuccess]);

  return (
    <div className="min-h-screen bg-[#070b12] flex items-center justify-center text-slate-400">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs">Завершение авторизации Google...</span>
      </div>
    </div>
  );
}
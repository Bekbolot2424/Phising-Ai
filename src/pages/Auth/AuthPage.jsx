import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Divider, message, ConfigProvider, theme } from 'antd';
import { Shield, User, Mail, Lock, Globe } from 'lucide-react';

const BASE_URL = "https://cybersecurityai.onrender.com";

// Обновленный URI редиректа: /google/callback
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth?client_id=311714709919-pku0sib5tlngkg2ucbr93d5da5tesolf.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Funruffled-reconcile-rival.ngrok-free.dev%2Fgoogle%2Fcallback&response_type=code&scope=openid%20email%20profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.readonly&access_type=offline&prompt=consent";
export default function AuthPage({ onLoginSuccess }) { 
  const [mode, setMode] = useState('signin'); 
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (mode === 'signup') {
        const response = await axios.post(`${BASE_URL}/api/v1/users/registration/`, {
          username: values.username,
          email: values.email,
          password: values.password
        });

        if (response.status === 201 || response.status === 200) {
          messageApi.success('Регистрация успешна! Теперь вы можете войти.');
          setMode('signin');
        }
      } else {
        const response = await axios.post(`${BASE_URL}/api/v1/users/login/`, {
          email: values.email,
          password: values.password
        });

        if (response.status === 200) {
          messageApi.success('Успешный вход! Добро пожаловать в систему.');
          setTimeout(() => {
            if (onLoginSuccess) onLoginSuccess();  
          }, 1500);
        }
      }
    } catch (err) {
      console.error('Ошибка при запросе:', err);
      if (err.response?.data?.message) {
        messageApi.error(err.response.data.message);
      } else {
        messageApi.error(mode === 'signup' ? 'Ошибка при регистрации!' : 'Неверный email или пароль!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: '#3b82f6', borderRadius: 12 },
      }}
    >
      {contextHolder}

      <div className="min-h-screen bg-[#070b12] flex items-center justify-center p-4 md:p-8 font-sans antialiased selection:bg-blue-500/30">
        <div className="w-full max-w-6xl bg-[#0d1527] border border-slate-800/60 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-2xl shadow-black/80">
          
          <PromoBlock />

          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-[#0a101f]">
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-xl shadow-blue-500/5">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white mt-4 tracking-tight">Добро пожаловать обратно</h2>
              <p className="text-slate-400 text-xs text-center mt-1.5 max-w-[280px]">
                Войдите в свой аккаунт или создайте новый, чтобы продолжить
              </p>
            </div>

            <div className="flex border-b border-slate-800/80 mb-8 relative">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 pb-3 text-sm font-semibold transition-colors duration-300 text-center relative z-10 ${
                  mode === 'signin' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-400'
                }`}
              >
                Войти
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 pb-3 text-sm font-semibold transition-colors duration-300 text-center relative z-10 ${
                  mode === 'signup' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-400'
                }`}
              >
                Регистрация
              </button>
              <div 
                className="absolute bottom-0 h-[2px] bg-blue-500 shadow-[0_0_8px_#3b82f6] transition-all duration-300 ease-in-out"
                style={{
                  width: '50%',
                  transform: mode === 'signin' ? 'translateX(0%)' : 'translateX(100%)'
                }}
              />
            </div>

            <Form
              name="auth_cyber_form"
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              autoComplete="off"
            >
              {mode === 'signup' && (
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: 'Пожалуйста, введите ваше имя пользователя!' }]}
                >
                  <Input 
                    prefix={<User size={18} className="text-slate-500 mr-2" />} 
                    placeholder="Имя пользователя" 
                    className="cyber-input"
                  />
                </Form.Item>
              )}

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Пожалуйста, введите адрес электронной почты!' },
                  { type: 'email', message: 'Пожалуйста, введите корректный адрес электронной почты!' }
                ]}
              >
                <Input 
                  prefix={<Mail size={18} className="text-slate-500 mr-2" />} 
                  placeholder="Электронная почта" 
                  className="cyber-input"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Пожалуйста, введите ваш пароль!' }]}
              >
                <Input.Password 
                  prefix={<Lock size={18} className="text-slate-500 mr-2" />} 
                  placeholder="Пароль" 
                  className="cyber-input"
                />
              </Form.Item>

              <Form.Item className="mt-6 mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 border-none hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.99]"
                >
                  {mode === 'signin' ? 'Войти' : 'Создать аккаунт'}
                </Button>
              </Form.Item>
            </Form>

            <Divider plain className="border-slate-800/80 text-slate-600 text-xs font-mono my-5">ИЛИ</Divider>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-11 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl flex items-center justify-center gap-3 transition-colors shadow-md active:scale-[0.99] cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span className="text-sm font-medium">Продолжить через Google</span>
            </button>

            <div className="text-center mt-6">
              <p className="text-xs text-slate-500">
                {mode === 'signin' ? "Нет аккаунта? " : "Уже есть аккаунт? "}
                <button 
                  type="button"
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-blue-500 hover:underline font-semibold ml-1 transition-all"
                >
                  {mode === 'signin' ? 'Зарегистрироваться' : 'Войти'}
                </button>
              </p>
            </div>
          </div>

        </div>
      </div>
    </ConfigProvider>
  );
}

function PromoBlock() {
  return (
    <div className="relative p-8 md:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/50 bg-gradient-to-br from-[#0d1527] via-[#090f1c] to-[#050810]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.08),transparent_70%)] pointer-events-none" />
      
      <div className="flex justify-center items-center my-auto w-full max-w-[420px] mx-auto aspect-[4/3] rounded-2xl border border-slate-800/80 bg-slate-950/50 relative overflow-hidden shadow-2xl shadow-black/40">
        <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg font-mono flex items-center gap-2 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Обнаружена подозрительная ссылка
        </div>
        
        <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 shadow-lg shadow-blue-500/5">
          <Shield size={64} className="text-blue-500/40 animate-pulse" />
        </div>
        
        <div className="absolute bottom-4 left-4 right-4 p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-center text-[11px] font-mono text-slate-500 truncate">
          http://secure-login-fake-portal.com
        </div>
      </div>

      <div className="mt-8 relative z-10">
        <span className="text-blue-500 uppercase tracking-widest text-xs font-bold font-mono">Phishing Defense</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-2 leading-tight">
          Stay sharp. <br />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Stay secure.</span>
        </h1>
        <p className="text-slate-400 text-sm mt-3 max-w-sm leading-relaxed">
          Присоединяйтесь к нашей платформе, чтобы учиться, выявлять и защищаться от фишинговых атак в режиме реального времени.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-slate-800/40 relative z-10">
        <div>
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2.5">
            <Shield size={16} />
          </div>
          <h4 className="text-xs font-semibold text-slate-200">Защита 24/7</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">Обнаружение угроз до того, как они дойдут.</p>
        </div>
        <div>
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2.5">
            <User size={16} />
          </div>
          <h4 className="text-xs font-semibold text-slate-200">Обучение</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">Узнайте, как именно работают атаки.</p>
        </div>
        <div>
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2.5">
            <Globe size={16} />
          </div>
          <h4 className="text-xs font-semibold text-slate-200">Аналитика</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">Отслеживайте, анализируйте и опережайте.</p>
        </div>
      </div>
    </div>
  );
}
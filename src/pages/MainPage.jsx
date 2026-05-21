import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../componets/Sidebar'; 
import { 
  ShieldAlert, AlertCircle, User, Link2, 
  FileText, RefreshCw, Shield, HelpCircle, AlertTriangle 
} from 'lucide-react';

const API_GMAIL_URL = 'https://cybersecurityai.onrender.com/api/v1/request-gmail-data/';

export default function MainPage({ onLogout }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  
  // Храним весь ответ от бэкенда
  const [emailData, setEmailData] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const googleToken = localStorage.getItem('googleAccessToken');
      if (!googleToken) { navigate('/auth'); return; }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const handleAnalyzeLatest = async () => {
    setAnalyzing(true);
    try {
      const appToken = localStorage.getItem('accessToken');
      const googleToken = localStorage.getItem('googleAccessToken');

      const response = await axios.post(API_GMAIL_URL, 
        { google_access_token: googleToken }, 
        { headers: { 'Authorization': `Bearer ${appToken}`, 'Content-Type': 'application/json' } }
      );
      
      // Сохраняем Response (внутри него: result, sender, url, text, subject)
      setEmailData(response.data);
    } catch (err) {
      alert("Ошибка при получении данных из Gmail: " + (err.response?.data?.detail || "Проверьте консоль"));
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex flex-col gap-4 items-center justify-center">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="text-slate-400 text-sm">Инициализация MailShield AI...</span>
      </div>
    );
  }

  // Свойства из корня нового ответа бэкенда
  const mailSender = emailData?.sender || "Нажмите кнопку для сканирования...";
  const mailSubject = emailData?.subject || "Ожидание сканирования..."; 
  const mailText = emailData?.text || "Здесь появится оригинальное содержание последнего письма после запуска сканирования.";
  const mailUrl = emailData?.url || "";

  // Данные анализа моделей (из объекта result)
  const result = emailData?.result;
  const isPhishing = result ? result.is_phishing : false;
  
  // Парсим число из строки типа "91 %" для корректного закрашивания SVG-круга
  const rawScore = result?.total_risk_score ? parseInt(result.total_risk_score) : 0;

  // Текстовые пояснения ИИ из вложенного объекта reasons (result.data)
  const aiSenderReason = result?.data?.["Отправитель"] || "Проверка адреса на фишинг подмену домена.";
  const aiTextReason = result?.data?.["Сообщение"] || "Сканирование лингвистических уловок и спам-маркеров.";
  const aiUrlReason = result?.data?.["Ссылка"] || "Проверка редиректов и репутации целевых URL-адресов.";

  // Процентные показатели составляющих риска
  const senderRiskPct = result?.sender_risk || "0 %";
  const textRiskPct = result?.text_risk || "0 %";
  const urlRiskPct = result?.url_risk || "0 %";

  return (
    <div className="min-h-screen bg-[#050a17] text-slate-100 flex font-sans antialiased">
      
      <Sidebar onLogout={onLogout} />
      
      <main className="flex-1 p-6 overflow-y-auto max-w-[1600px] mx-auto w-full space-y-6">
        
        {/* Верхняя статус-панель */}
        <div className="flex justify-between items-center bg-[#0b1329]/60 p-4 rounded-xl border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${emailData ? (isPhishing ? 'bg-red-500' : 'bg-green-500') : 'bg-blue-500'}`} />
            <div>
              <h1 className="text-xs font-bold text-white tracking-wider uppercase">AI PROTECTION ACTIVE</h1>
              <p className="text-[11px] text-slate-400">Прямое подключение к Gmail API настроено успешно</p>
            </div>
          </div>
          
          <button
            onClick={handleAnalyzeLatest}
            disabled={analyzing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/40 text-white text-xs font-semibold rounded-lg transition-all duration-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
            {analyzing ? "Загрузка из Gmail..." : "Загрузить последнее письмо из Gmail"}
          </button>
        </div>

        {/* ГЛАВНЫЙ ИНТЕРФЕЙСНЫЙ БЛОК */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ПРОСМОТР ЖИВОГО ПИСЬМА */}
          <div className="lg:col-span-2 bg-[#0b1329] border border-slate-800/80 rounded-xl flex flex-col overflow-hidden">
            
            {/* Header карточки просмотра */}
            <div className="px-5 py-4 border-b border-slate-800/80 flex justify-between items-center bg-[#0c152e]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">Просмотр письма</span>
                {emailData && (
                  <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wide border ${
                    isPhishing ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'
                  }`}>
                    • {isPhishing ? 'ПОДОЗРИТЕЛЬНОЕ' : 'БЕЗОПАСНО'}
                  </span>
                )}
              </div>
              <div className="flex gap-2 text-xs text-slate-400">
                <button className="px-3 py-1 bg-slate-800/40 hover:bg-slate-800 rounded text-[11px] border border-slate-700/50">Ответить</button>
                <button className="px-3 py-1 bg-slate-800/40 hover:bg-slate-800 rounded text-[11px] border border-slate-700/50">Переслать</button>
              </div>
            </div>

            {/* Мета-данные (Отправитель, Тема) напрямую из полей ответа */}
            <div className="p-5 border-b border-slate-800/60 space-y-2.5 text-xs text-slate-300 bg-[#090f24]/50">
              <div className="flex items-center">
                <span className="w-14 text-slate-500 font-medium">От:</span>
                <span className={`font-mono text-[11px] ${isPhishing ? 'text-red-400' : 'text-slate-300'}`}>{mailSender}</span>
              </div>
              <div className="flex">
                <span className="w-14 text-slate-500 font-medium">Кому:</span>
                <span className="font-mono text-slate-400">Ваш аккаунт Gmail</span>
              </div>
              <div className="flex items-center">
                <span className="w-14 text-slate-500 font-medium">Тема:</span>
                <span className="font-semibold text-white text-[13px]">{mailSubject}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/20">
                <div>Источник данных: <span className="text-slate-400">Gmail Входящие (Последнее)</span></div>
                <div>Приоритет: <span className={`font-black text-[10px] ${isPhishing ? 'text-red-400' : 'text-green-400'}`}>{isPhishing ? 'ВЫСОКИЙ' : 'НОРМАЛЬНЫЙ'}</span></div>
              </div>
            </div>

            {/* ТЕЛО СТРОГО ОРИГИНАЛЬНОГО ПИСЬМА (emailData.text) */}
            <div className="p-5 flex-1 bg-[#060b18] m-4 rounded-xl border border-slate-900/60 flex flex-col justify-between min-h-[280px]">
              <div>
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-3">
                  <FileText className="w-3.5 h-3.5 text-blue-500" /> Содержимое входящего сообщения
                </div>
                {/* Сюда рендерится чистый текст оригинального письма */}
                <div className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-sans bg-[#0b1329]/40 p-4 rounded-lg border border-slate-800/40 min-h-[140px]">
                  {mailText}
                </div>
              </div>

              {/* Отображение извлеченного URL-адреса */}
              {mailUrl && (
                <div className={`mt-4 flex items-center justify-between p-3 rounded-lg border ${
                  isPhishing ? 'bg-red-950/20 border-red-900/40 text-red-400' : 'bg-slate-900/50 border-slate-800 text-slate-400'
                }`}>
                  <div className="flex items-center gap-2 text-xs truncate mr-2">
                    <Link2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-mono truncate">{mailUrl}</span>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shrink-0 border ${
                    isPhishing ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'
                  }`}>
                    {isPhishing ? 'Опасная ссылка' : 'Проверенная ссылка'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ: ВИДЖЕТЫ АНАЛИЗА И ВЕРДИКТОВ */}
          <div className="space-y-6">
            
            {/* Круговой Risk Score */}
            <div className="bg-[#0b1329] border border-slate-800/80 rounded-xl p-5 flex flex-col items-center relative overflow-hidden shadow-xl">
              <div className="w-full flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
                  RISK SCORE <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                </span>
              </div>

              <div className="relative w-36 h-36 flex items-center justify-center my-3">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#111827" strokeWidth="8" fill="transparent" />
                  <circle cx="50" cy="50" r="40" 
                    stroke={isPhishing ? "#ef4444" : "#10b981"} 
                    strokeWidth="8" fill="transparent" 
                    strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * rawScore) / 100}
                    strokeLinecap="round" className="transition-all duration-500" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-white tracking-tighter">
                    {result ? result.total_risk_score : "0%"}
                  </span>
                </div>
              </div>

              <div className="text-center space-y-1 w-full z-10">
                <p className={`text-xs font-black tracking-widest uppercase ${isPhishing ? 'text-red-500' : 'text-green-500'}`}>
                  {isPhishing ? 'ВЫСОКИЙ РИСК' : 'НИЗКИЙ РИСК'}
                </p>
                <div className={`inline-block px-3 py-0.5 text-white font-black text-[10px] rounded tracking-widest uppercase ${
                  isPhishing ? 'bg-red-500' : 'bg-green-500'
                }`}>
                  {isPhishing ? 'ОПАСНО' : 'БЕЗОПАСНО'}
                </div>
                <p className="text-[11px] text-slate-400 pt-3 border-t border-slate-800/60 mt-2">
                  {isPhishing 
                    ? 'Письмо содержит критические фишинговые уязвимости или поддельные адреса.' 
                    : 'Нейросетевые детекторы верифицировали письмо. Угроз не обнаружено.'}
                </p>
              </div>

              <Shield className={`absolute -right-6 -bottom-6 w-24 h-24 ${isPhishing ? 'text-red-500/5' : 'text-green-500/5'} pointer-events-none`} />
            </div>

            {/* Причины вердикта ИИ (из result.data) */}
            <div className="bg-[#0b1329] border border-slate-800/80 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">Причины вердикта</h3>
              
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className={`p-1.5 rounded mt-0.5 shrink-0 ${isPhishing ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}><User className="w-3.5 h-3.5" /></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Анализ отправителя ({senderRiskPct})</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                      {aiSenderReason}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className={`p-1.5 rounded mt-0.5 shrink-0 ${isPhishing ? 'bg-orange-500/10 text-orange-400' : 'bg-green-500/10 text-green-400'}`}><AlertCircle className="w-3.5 h-3.5" /></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Текст сообщения ({textRiskPct})</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                      {aiTextReason}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className={`p-1.5 rounded mt-0.5 shrink-0 ${isPhishing ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}><Link2 className="w-3.5 h-3.5" /></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Анализ вложений и ссылок ({urlRiskPct})</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                      {aiUrlReason}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* НИЖНИЕ ИНДИКАТОРЫ УГРОЗ */}
        <div className="bg-[#0b1329] border border-slate-800/80 rounded-xl p-5 shadow-xl">
          <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4">Индикаторы угроз</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            
            <div className={`p-3 bg-[#070d1e] border rounded-lg flex flex-col gap-2 ${isPhishing ? 'border-red-900/30' : 'border-slate-800/60'}`}>
              <User className={`w-4 h-4 ${isPhishing ? 'text-red-400' : 'text-slate-600'}`} />
              <span className="text-xs font-bold text-slate-200">Адрес ({senderRiskPct})</span>
              <span className="text-[10px] text-slate-400 leading-tight">Проверка на нахождение в глобальных спам-листах</span>
            </div>

            <div className={`p-3 bg-[#070d1e] border rounded-lg flex flex-col gap-2 ${isPhishing ? 'border-orange-900/30' : 'border-slate-800/60'}`}>
              <FileText className={`w-4 h-4 ${isPhishing ? 'text-orange-400' : 'text-slate-600'}`} />
              <span className="text-xs font-bold text-slate-200">Опасные слова ({textRiskPct})</span>
              <span className="text-[10px] text-slate-400 leading-tight">Поиск NLP-моделью скрытых угроз и шантажа</span>
            </div>

            <div className={`p-3 bg-[#070d1e] border rounded-lg flex flex-col gap-2 ${isPhishing ? 'border-red-900/30' : 'border-slate-800/60'}`}>
              <Link2 className={`w-4 h-4 ${isPhishing ? 'text-red-400' : 'text-slate-600'}`} />
              <span className="text-xs font-bold text-slate-200">Фишинг ссылки ({urlRiskPct})</span>
              <span className="text-[10px] text-slate-400 leading-tight">Анализ целевых URL-адресов на клонирование брендов</span>
            </div>

            <div className={`p-3 bg-[#070d1e] border rounded-lg flex flex-col gap-2 ${isPhishing ? 'border-orange-900/30' : 'border-slate-800/60'}`}>
              <ShieldAlert className={`w-4 h-4 ${isPhishing ? 'text-orange-400' : 'text-slate-600'}`} />
              <span className="text-xs font-bold text-slate-200">Личные данные</span>
              <span className="text-[10px] text-slate-400 leading-tight">Детекция форм запроса паролей, сессий и ПДн</span>
            </div>

            <div className={`p-3 bg-[#070d1e] border rounded-lg flex flex-col gap-2 col-span-2 md:col-span-1 ${isPhishing ? 'border-red-900/30' : 'border-slate-800/60'}`}>
              <AlertTriangle className={`w-4 h-4 ${isPhishing ? 'text-red-400' : 'text-slate-600'}`} />
              <span className="text-xs font-bold text-slate-200">Репутация</span>
              <span className="text-[10px] text-slate-400 leading-tight">Проверка цифровой подписи (DKIM, SPF, DMARC)</span>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
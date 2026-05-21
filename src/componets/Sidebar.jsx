import React from 'react';
import { 
  LayoutDashboard, ShieldAlert, History, 
  BarChart3, Settings, ShieldCheck, LogOut 
} from 'lucide-react';

// ИСПРАВЛЕНИЕ 1: Теперь принимаем пропс onLogout от родителя
export default function Sidebar({ onLogout }) {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Главная', desc: 'Обзор системы', active: true },
    { icon: <ShieldAlert size={20} />, label: 'Анализ письма', desc: 'Проверка угроз' },
    { icon: <History size={20} />, label: 'История', desc: 'Проверенные письма' },
    { icon: <BarChart3 size={20} />, label: 'Статистика', desc: 'Аналитика и отчёты' },
    { icon: <Settings size={20} />, label: 'Настройки', desc: 'Параметры системы' },
  ];

  return (
    <aside className="w-64 bg-[#0a101f] border-r border-slate-800/60 p-4 flex flex-col justify-between h-screen sticky top-0 shrink-0">
      <div>
        {/* Логотип */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/5">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide uppercase">MailShield AI</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wider">AI Email Security</p>
          </div>
        </div>

        {/* Навигация */}
        <nav className="space-y-1.5">
          {menuItems.map((item, index) => (
            <button
              key={index}
              type="button"
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-200 group text-left cursor-pointer ${
                item.active
                  ? 'bg-blue-600/10 border border-blue-500/20 text-blue-400'
                  : 'border border-transparent text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
              }`}
            >
              <div className={item.active ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-400'}>
                {item.icon}
              </div>
              <div>
                <div className="text-xs font-semibold tracking-wide">{item.label}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">{item.desc}</div>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Нижний блок: статус-индикатор + кнопка выхода */}
      <div className="space-y-3.5">
        
        {/* Виджет сканирования */}
        <div className="relative rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-950/40 to-slate-950/80 p-4 overflow-hidden shadow-xl shadow-black/20">
          <div className="absolute -right-6 -bottom-6 text-blue-500/5 pointer-events-none">
            <ShieldCheck size={100} />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Сканирование Gmail
          </div>
          <div className="text-[10px] text-emerald-500 font-medium mt-1">Активно</div>
          <div className="text-[9px] text-slate-500 font-mono mt-3 pt-2 border-t border-slate-900">
            Последняя проверка:<br />2 мин назад
          </div>
        </div>

        {/* ИСПРАВЛЕНИЕ 2: Кнопка «Выйти из аккаунта» */}
        <button
          type="button"
          onClick={onLogout} // Привязываем клик к передаваемой функции выхода
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200 cursor-pointer group"
        >
          <LogOut size={16} className="text-red-500/60 group-hover:text-red-400 transition-colors" />
          <span>Выйти из системы</span>
        </button>

      </div>
    </aside>
  );
}
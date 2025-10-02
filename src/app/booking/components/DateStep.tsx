// Paso 2: Selección de fecha y horario (sólo UI, sin lógica de Firestore aún)
import { Button } from "@/components/ui/button";
import React from "react";

const daysOfWeek = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];


function getMondayOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // 0 (Dom) => -6, 1 (Lun) => 0, ...
  d.setDate(d.getDate() + diff);
  d.setHours(0,0,0,0);
  return d;
}

function getWeekDays(startDate: Date) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    days.push(d);
  }
  return days;
}

type Props = {
  onSelect: (date: string) => void;
  selectedDate?: string;
  onBack: () => void;
};


import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function DateStep({ onSelect, selectedDate, onBack }: Props) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [config, setConfig] = useState<Record<string, { start: string; end: string }[] | undefined> & { bloqueados?: string[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const monday = getMondayOfWeek(new Date(today.getFullYear(), today.getMonth(), today.getDate() + weekOffset * 7));
  const days = getWeekDays(monday);

  useEffect(() => {
    async function fetchConfig() {
      setLoading(true);
      const ref = doc(db, "schedule_config", "main");
      const snap = await getDoc(ref);
      setConfig(snap.exists() ? snap.data() : {});
      setLoading(false);
    }
    fetchConfig();
  }, []);

  // Días bloqueados (feriados)
  const bloqueados: string[] = config?.bloqueados || [];

  function isDayBlocked(date: Date) {
    const iso = date.toISOString().slice(0, 10);
    if (bloqueados.includes(iso)) return true;
    // Bloquear días pasados de la semana actual
    const todayDate = new Date();
    todayDate.setHours(0,0,0,0);
    if (
      date < todayDate &&
      date >= getMondayOfWeek(todayDate) &&
      date <= todayDate
    ) {
      return true;
    }
    // Verifica si hay horario para ese día
    const dias = ["domingo","lunes","martes","miercoles","jueves","viernes","sabado"];
    const dia = dias[date.getDay()];
    const horarios = config?.[dia]?.[0];
    if (!horarios || !horarios.start || !horarios.end) return true;
    return false;
  }

  const mesActual = days[0].toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Mes actual con estilo premium */}
      <div className="mb-6 sm:mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-blue-50 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border border-indigo-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <span className="text-base sm:text-xl font-bold text-indigo-900 capitalize">{mesActual}</span>
        </div>
      </div>

      {/* Selector de semana con días */}
      <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8 w-full px-2">
        <button
          className="flex-shrink-0 p-2 sm:p-3 rounded-xl bg-white hover:bg-indigo-50 border-2 border-gray-200 hover:border-indigo-300 transition-all shadow-sm hover:shadow-md touch-manipulation"
          onClick={() => setWeekOffset((w) => w - 1)}
          aria-label="Semana anterior"
        >
          <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>
        
        <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3 flex-1 max-w-4xl">
          {days.map((d) => {
            const iso = d.toISOString().slice(0, 10);
            const dayName = daysOfWeek[d.getDay() === 0 ? 6 : d.getDay() - 1];
            const dayNum = d.getDate();
            const blocked = loading ? false : isDayBlocked(d);
            const isSelected = selectedDate === iso;
            const isToday = new Date().toISOString().slice(0, 10) === iso;
            
            return (
              <button
                key={iso}
                onClick={() => !blocked && onSelect(iso)}
                disabled={blocked}
                className={`transition-all duration-300 relative rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 font-semibold shadow-md border-2 focus:outline-none focus:ring-4 focus:ring-indigo-200 touch-manipulation min-h-[60px] sm:min-h-[70px]
                  ${isSelected
                    ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white border-indigo-600 scale-105 shadow-xl shadow-indigo-300'
                    : blocked
                      ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed opacity-50'
                      : 'bg-white border-gray-200 hover:scale-105 hover:border-indigo-300 hover:shadow-lg text-gray-900 active:scale-95'}
                `}
              >
                {/* Indicador de hoy */}
                {isToday && !isSelected && (
                  <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-500 rounded-full"></div>
                )}
                
                {/* Check para día seleccionado */}
                {isSelected && (
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-emerald-500 rounded-full p-0.5 sm:p-1 shadow-lg animate-bounce-in">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 text-white">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                
                <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                  <span className={`text-[9px] sm:text-xs font-medium uppercase ${isSelected ? 'text-white/80' : blocked ? 'text-gray-400' : 'text-gray-500'}`}>
                    {dayName}
                  </span>
                  <span className={`text-lg sm:text-xl md:text-2xl font-bold ${blocked ? 'line-through' : ''}`}>
                    {dayNum}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        
        <button
          className="flex-shrink-0 p-2 sm:p-3 rounded-xl bg-white hover:bg-indigo-50 border-2 border-gray-200 hover:border-indigo-300 transition-all shadow-sm hover:shadow-md touch-manipulation"
          onClick={() => setWeekOffset((w) => w + 1)}
          aria-label="Semana siguiente"
        >
          <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>
      </div>

      {/* Botón volver */}
      <button
        className="mt-4 px-6 sm:px-8 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 border-2 border-gray-200 text-gray-700 font-semibold transition-all hover:scale-105 flex items-center gap-2 touch-manipulation w-full sm:w-auto max-w-xs"
        onClick={onBack}
      >
        <ChevronLeftIcon className="w-5 h-5" />
        Volver
      </button>

      <style>{`
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-bounce-in { animation: bounce-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
      `}</style>
    </div>
  );
}

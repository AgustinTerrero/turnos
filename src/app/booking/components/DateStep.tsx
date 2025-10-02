// Paso 2: Selección de fecha con carrusel moderno
"use client";
import React, { useEffect, useState, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

type Props = {
  onSelect: (date: string) => void;
  selectedDate?: string;
  onBack: () => void;
};

// Generar array de días para un mes específico
function generateDaysForMonth(year: number, month: number) {
  const days = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  return days;
}

export default function DateStep({ onSelect, selectedDate, onBack }: Props) {
  const [config, setConfig] = useState<Record<string, { start: string; end: string }[] | undefined> & { bloqueados?: string[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [centerIndex, setCenterIndex] = useState(0); // Índice del día en el centro
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dayRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  // Control de mes
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  
  const days = generateDaysForMonth(currentYear, currentMonth);
  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  useEffect(() => {
    async function fetchConfig() {
      setLoading(true);
      try {
        const ref = doc(db, "schedule_config", "main");
        const snap = await getDoc(ref);
        setConfig(snap.exists() ? snap.data() : {});
      } catch (error) {
        console.error("Error loading config:", error);
        setConfig({});
      }
      setLoading(false);
    }
    fetchConfig();
  }, []);

  // Detectar qué elemento está en el centro usando Intersection Observer
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observerOptions = {
      root: container,
      rootMargin: '0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    };

    const observer = new IntersectionObserver((entries) => {
      // Encontrar el elemento más cercano al centro
      let closestEntry: IntersectionObserverEntry | null = null;
      let closestDistance = Infinity;

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const rect = entry.boundingClientRect;
          const containerRect = container.getBoundingClientRect();
          const containerCenter = containerRect.left + containerRect.width / 2;
          const elementCenter = rect.left + rect.width / 2;
          const distance = Math.abs(containerCenter - elementCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestEntry = entry;
          }
        }
      });

      if (closestEntry) {
        const index = dayRefs.current.findIndex(ref => ref === closestEntry!.target);
        if (index !== -1 && index !== centerIndex) {
          setCenterIndex(index);
        }
      }
    }, observerOptions);

    // Observar todos los días
    dayRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [days.length, centerIndex]);

  // Auto-scroll al día seleccionado
  useEffect(() => {
    if (scrollContainerRef.current && selectedIndex >= 0) {
      const container = scrollContainerRef.current;
      const itemWidth = 100 + 12; // width + gap
      const targetScroll = itemWidth * selectedIndex - container.clientWidth / 2 + 50;
      container.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
    }
  }, [selectedIndex]);

  // Bloqueo de días
  const bloqueados: string[] = config?.bloqueados || [];

  function isDayBlocked(date: Date) {
    const iso = date.toISOString().slice(0, 10);
    if (bloqueados.includes(iso)) return true;
    
    // Solo bloquear si es anterior a HOY (no al día 1 del mes)
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate < todayDate) return true;
    
    const dias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const dia = dias[date.getDay()];
    const horarios = config?.[dia]?.[0];
    if (!horarios || !horarios.start || !horarios.end) return true;
    return false;
  }

  const handleDayClick = (index: number, date: Date) => {
    if (isDayBlocked(date)) return;
    setSelectedIndex(index);
    onSelect(date.toISOString().slice(0, 10));
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

  // Navegación de meses
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedIndex(0);
    setCenterIndex(0);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedIndex(0);
    setCenterIndex(0);
  };

  const mesActual = new Date(currentYear, currentMonth).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Selector de mes con navegación */}
      <div className="mb-6 sm:mb-8 text-center">
        <div className="inline-flex items-center gap-2 sm:gap-4 bg-gradient-to-r from-indigo-50 to-blue-50 px-3 sm:px-6 py-2 sm:py-3 rounded-2xl border border-indigo-100">
          {/* Botón mes anterior */}
          <button
            onClick={goToPreviousMonth}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-indigo-100 transition-all hover:scale-110 active:scale-95"
            aria-label="Mes anterior"
          >
            <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
          </button>

          {/* Icono y mes */}
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span className="text-base sm:text-xl font-bold text-indigo-900 capitalize min-w-[150px] sm:min-w-[200px]">{mesActual}</span>
          </div>

          {/* Botón mes siguiente */}
          <button
            onClick={goToNextMonth}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-indigo-100 transition-all hover:scale-110 active:scale-95"
            aria-label="Mes siguiente"
          >
            <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
          </button>
        </div>
      </div>

      {/* Carrusel de fechas */}
      <div className="relative w-full mb-8 px-2 sm:px-4">
        {/* Botón izquierdo - Desktop */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all hover:scale-110 hidden sm:flex items-center justify-center"
          aria-label="Anterior"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
        </button>

        {/* Contenedor scroll con carrusel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 sm:px-12 py-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {days.map((date, index) => {
            const iso = date.toISOString().slice(0, 10);
            const dayName = daysOfWeek[date.getDay()];
            const dayNum = date.getDate();
            const blocked = loading ? false : isDayBlocked(date);
            const isSelected = selectedDate === iso;
            const isToday = new Date().toISOString().slice(0, 10) === iso;
            
            // Calcular distancia del centro para efecto de escala
            const distance = Math.abs(index - centerIndex);
            const scale = distance === 0 ? 1.1 : distance === 1 ? 0.9 : 0.75;
            const opacity = blocked ? 0.3 : distance === 0 ? 1 : distance === 1 ? 0.8 : 0.5;
            const isCentered = index === centerIndex;
            
            return (
              <button
                key={iso}
                ref={el => { dayRefs.current[index] = el; }}
                onClick={() => handleDayClick(index, date)}
                disabled={blocked}
                className={`snap-center flex-shrink-0 transition-all duration-500 ease-out rounded-2xl p-4 border-2 shadow-md relative ${
                  blocked
                    ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                    : isSelected
                      ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white border-indigo-600 shadow-2xl shadow-indigo-300'
                      : isCentered && !isSelected
                        ? 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-400 shadow-lg text-gray-900'
                        : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-lg text-gray-900'
                }`}
                style={{
                  transform: `scale(${scale})`,
                  opacity: opacity,
                  width: '100px',
                  minWidth: '100px',
                  height: '110px'
                }}
              >
                {/* Badge de HOY */}
                {isToday && !isSelected && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-bold rounded-full shadow-md">
                    HOY
                  </div>
                )}
                
                {/* Check para seleccionado */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-1.5 shadow-lg animate-bounce-in">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                
                <div className="flex flex-col items-center gap-1 justify-center h-full">
                  <span className={`text-xs font-semibold uppercase ${
                    isSelected ? 'text-white/80' : blocked ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {dayName}
                  </span>
                  <span className={`text-4xl font-bold ${blocked ? 'line-through' : ''}`}>
                    {dayNum}
                  </span>
                  <span className={`text-[10px] font-medium mt-1 ${
                    isSelected ? 'text-white/60' : 'text-gray-400'
                  }`}>
                    {date.toLocaleDateString('es-ES', { month: 'short' })}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Botón derecho - Desktop */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all hover:scale-110 hidden sm:flex items-center justify-center"
          aria-label="Siguiente"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Hint para mobile */}
      <div className="text-center mb-6 sm:hidden">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          Desliza para ver más fechas
        </p>
      </div>

      {/* Botón volver */}
      <button
        className="px-8 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 border-2 border-gray-200 text-gray-700 font-semibold transition-all hover:scale-105 flex items-center gap-2"
        onClick={onBack}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Volver
      </button>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { 
          display: none; 
        }
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-bounce-in { 
          animation: bounce-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); 
        }
      `}</style>
    </div>
  );
}

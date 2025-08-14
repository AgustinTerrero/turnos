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
    // Verifica si hay horario para ese día
    const dias = ["domingo","lunes","martes","miercoles","jueves","viernes","sabado"];
    const dia = dias[date.getDay()];
    const horarios = config?.[dia]?.[0];
    if (!horarios || !horarios.start || !horarios.end) return true;
    return false;
  }

  const mesActual = days[0].toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-extrabold mb-2 tracking-tight text-gray-900 text-center">2. Elegí la fecha</h2>
      <div className="mb-4 text-lg font-semibold text-primary-700 capitalize">{mesActual}</div>
      <div className="flex items-center gap-2 mb-8">
        <button
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          onClick={() => setWeekOffset((w) => w - 1)}
          aria-label="Semana anterior"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <div className="flex gap-3 flex-wrap justify-center w-full max-w-xl">
          {days.map((d) => {
            const iso = d.toISOString().slice(0, 10);
            const label = `${daysOfWeek[d.getDay() === 0 ? 6 : d.getDay() - 1]} ${d.getDate()}`;
            const blocked = loading ? false : isDayBlocked(d);
            return (
              <button
                key={iso}
                onClick={() => !blocked && onSelect(iso)}
                disabled={blocked}
                className={`transition rounded-xl px-5 py-4 font-semibold text-lg shadow border-2 focus:outline-none focus:ring-2 focus:ring-primary-400
                  ${selectedDate === iso
                    ? 'bg-gradient-to-br from-primary-500 to-primary-400 text-white border-primary-500 scale-105 shadow-xl'
                    : blocked
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed line-through'
                      : 'bg-white border-gray-200 hover:scale-105 hover:border-primary-400 hover:shadow-md text-gray-900'}
                `}
                style={{ background: selectedDate === iso ? 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)' : undefined }}
              >
                {label}
              </button>
            );
          })}
        </div>
        <button
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          onClick={() => setWeekOffset((w) => w + 1)}
          aria-label="Semana siguiente"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
      <button
        className="mt-2 px-6 py-3 rounded-lg bg-gray-100 text-primary-700 font-semibold hover:bg-gray-200 transition"
        onClick={onBack}
      >
        ← Volver
      </button>
    </div>
  );
}

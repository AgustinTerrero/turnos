import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";


type Props = {
  onSelect: (time: string) => void;
  selectedTime?: string;
  onBack: () => void;
  date: string;
};

function getDayName(date: Date) {
  return date.toLocaleDateString("es-ES", { weekday: "long" }).toLowerCase();
}

function generateSlotsForDay(ranges: { start: string; end: string }[], date: Date, duration: number) {
  const slots: string[] = [];
  for (const range of ranges) {
    const [h, m] = range.start.split(":").map(Number);
    const [hEnd, mEnd] = range.end.split(":").map(Number);
  const current = new Date(date);
    current.setHours(h, m, 0, 0);
    const end = new Date(date);
    end.setHours(hEnd, mEnd, 0, 0);
    while (current.getTime() + duration * 60000 <= end.getTime()) {
      const slot = current.toTimeString().slice(0, 5);
      slots.push(slot);
      current.setMinutes(current.getMinutes() + duration);
    }
  }
  return slots;
}

const TimeStep: React.FC<Props> = ({ onSelect, selectedTime, onBack, date }) => {
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<string[]>([]);
  const [reserved, setReserved] = useState<Set<string>>(new Set());
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  useEffect(() => {
    if (!client) return;
    let unsubConfig: (() => void) | null = null;
    let unsubAppointments: (() => void) | null = null;
    setLoading(true);

    const configRef = collection(db, "schedule_config");
    unsubConfig = onSnapshot(query(configRef), async (snap) => {
      const configDoc = snap.docs ? snap.docs.find((d) => d.id === "main") : null;
      const config = configDoc ? configDoc.data() : null;
      if (!config) {
        setSlots([]);
        setLoading(false);
        return;
      }
      const dateObj = new Date(date + "T00:00:00");
      const dayName = getDayName(dateObj);
      const ranges = config[dayName] || [];
      const duration = 30;
      const generatedSlots = generateSlotsForDay(ranges, dateObj, duration);
      setSlots(generatedSlots);

      const appointmentsRef = collection(db, "appointments");
      const q = query(appointmentsRef, where("date", "==", date));
      unsubAppointments = onSnapshot(q, (snap2) => {
        const reservedTimes = new Set<string>(snap2.docs.map((d) => d.data().time as string));
        setReserved(reservedTimes);
        setLoading(false);
      });
    });

    return () => {
      if (unsubConfig) unsubConfig();
      if (unsubAppointments) unsubAppointments();
    };
  }, [date, client]);

  if (!client) return null;

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Fecha seleccionada */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-3 rounded-2xl border border-indigo-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-lg font-bold text-indigo-900">
            {typeof date === 'string' ? date.split("-").reverse().join("/") : ''}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-lg text-indigo-600 mb-8">
          <div className="animate-spin h-7 w-7 border-3 border-indigo-600 border-t-transparent rounded-full"></div>
          <span className="font-medium">Cargando horarios disponibles...</span>
        </div>
      ) : slots.length === 0 ? (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 mb-8 max-w-md">
          <div className="flex flex-col items-center gap-3 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-amber-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-amber-900 font-semibold text-lg">No hay horarios disponibles</p>
            <p className="text-amber-700 text-sm">Elegí otro día para ver disponibilidad</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8 w-full max-w-3xl">
          {slots.map((slot) => {
            const isSelected = selectedTime === slot;
            const isReserved = reserved.has(slot);
            return (
              <button
                key={slot}
                onClick={() => !isReserved && onSelect(slot)}
                disabled={isReserved}
                className={`transition-all duration-300 relative rounded-xl px-6 py-5 font-bold text-lg shadow-md border-2 focus:outline-none focus:ring-4 focus:ring-indigo-200
                  ${isSelected
                    ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white border-indigo-600 scale-105 shadow-xl shadow-indigo-300'
                    : isReserved
                      ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed opacity-40'
                      : 'bg-white border-gray-200 hover:scale-105 hover:border-indigo-300 hover:shadow-lg text-gray-900'}
                `}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-1 shadow-lg animate-bounce-in">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {isReserved && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
                <div className="flex flex-col items-center">
                  <span className={isReserved ? 'line-through' : ''}>{slot}</span>
                  {!isReserved && !isSelected && (
                    <span className="text-xs text-gray-500 mt-1">Disponible</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Leyenda */}
      <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-6 mb-8 text-sm max-w-sm sm:max-w-none mx-auto sm:mx-0">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-indigo-600 to-blue-600 flex-shrink-0"></div>
          <span className="text-gray-600">Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white border-2 border-gray-200 flex-shrink-0"></div>
          <span className="text-gray-600">Disponible</span>
        </div>
        <div className="flex items-center gap-2 col-span-2 sm:col-span-1 justify-center sm:justify-start">
          <div className="w-4 h-4 rounded bg-gray-50 border-2 border-gray-200 opacity-40 flex-shrink-0"></div>
          <span className="text-gray-600">Reservado</span>
        </div>
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
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-bounce-in { animation: bounce-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
      `}</style>
    </div>
  );
};

export default TimeStep;

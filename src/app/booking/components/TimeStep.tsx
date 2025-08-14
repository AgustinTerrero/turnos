import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";

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
  let slots: string[] = [];
  for (const range of ranges) {
    const [h, m] = range.start.split(":").map(Number);
    const [hEnd, mEnd] = range.end.split(":").map(Number);
    let current = new Date(date);
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
    unsubConfig = onSnapshot(query(configRef), async (snap: any) => {
      const configDoc = snap.docs ? snap.docs.find((d: any) => d.id === "main") : null;
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
      unsubAppointments = onSnapshot(q, (snap2: any) => {
        const reservedTimes = new Set<string>(snap2.docs.map((d: any) => d.data().time as string));
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
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-extrabold mb-6 tracking-tight text-gray-900 text-center">3. Elegí el horario</h2>
      <div className="mb-2 text-muted-foreground text-base text-center">
        Para el día <b>{typeof date === 'string' ? date.split("-").reverse().join("/") : ''}</b>
      </div>
      {loading ? (
        <div className="mb-4 text-lg text-gray-500">Cargando horarios...</div>
      ) : (
        <div className="flex gap-3 mb-8 flex-wrap justify-center w-full max-w-xl">
          {slots.length ? slots.map((slot) => (
            <button
              key={slot}
              onClick={() => !reserved.has(slot) && onSelect(slot)}
              disabled={reserved.has(slot)}
              className={`transition rounded-xl px-5 py-4 font-semibold text-lg shadow border-2 focus:outline-none focus:ring-2 focus:ring-primary-400
                ${selectedTime === slot
                  ? 'bg-gradient-to-br from-primary-500 to-primary-400 text-white border-primary-500 scale-105 shadow-xl'
                  : reserved.has(slot)
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed line-through'
                    : 'bg-white border-gray-200 hover:scale-105 hover:border-primary-400 hover:shadow-md text-gray-900'}
              `}
              style={{ background: selectedTime === slot ? 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)' : undefined }}
            >
              {slot}
            </button>
          )) : <div className="text-gray-400">No hay horarios disponibles este día.</div>}
        </div>
      )}
      <button
        className="mt-2 px-6 py-3 rounded-lg bg-gray-100 text-primary-700 font-semibold hover:bg-gray-200 transition"
        onClick={onBack}
      >
        ← Volver
      </button>
    </div>
  );
};

export default TimeStep;

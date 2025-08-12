import { Button } from "@/components/ui/button";
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

export default function TimeStep({ onSelect, selectedTime, onBack, date }: Props) {
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
    <div>
      <h2 className="text-xl font-semibold mb-4">3. Selecciona horario</h2>
      <div className="mb-2 text-muted-foreground text-sm">
        Para el día <b>{typeof date === 'string' ? date.split("-").reverse().join("/") : ''}</b>
      </div>
      {loading ? (
        <div className="mb-6">Cargando horarios...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {slots.length ? slots.map((slot) => (
            <Button
              key={slot}
              variant={selectedTime === slot ? "default" : reserved.has(slot) ? "secondary" : "outline"}
              onClick={() => !reserved.has(slot) && onSelect(slot)}
              disabled={reserved.has(slot)}
            >
              {slot}
            </Button>
          )) : <div className="col-span-3">No hay horarios disponibles este día.</div>}
        </div>
      )}
      <Button variant="secondary" onClick={onBack}>
        ← Volver
      </Button>
    </div>
  );
}

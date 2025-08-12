// Paso 2: Selección de fecha y horario (sólo UI, sin lógica de Firestore aún)
import { Button } from "@/components/ui/button";
import React from "react";

const daysOfWeek = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// Genera los próximos 7 días
function getNext7Days() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

type Props = {
  onSelect: (date: string) => void;
  selectedDate?: string;
  onBack: () => void;
};

export default function DateStep({ onSelect, selectedDate, onBack }: Props) {
  const days = getNext7Days();
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">2. Elige fecha</h2>
      <div className="flex gap-2 mb-6 flex-wrap">
        {days.map((d) => {
          const iso = d.toISOString().slice(0, 10);
          const label = `${daysOfWeek[d.getDay() === 0 ? 6 : d.getDay() - 1]} ${d.getDate()}`;
          return (
            <Button
              key={iso}
              variant={selectedDate === iso ? "default" : "outline"}
              onClick={() => onSelect(iso)}
            >
              {label}
            </Button>
          );
        })}
      </div>
      <Button variant="secondary" onClick={onBack}>
        ← Volver
      </Button>
    </div>
  );
}

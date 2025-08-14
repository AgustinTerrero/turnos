// Paso 1: Selección de servicio usando shadcn/ui
// import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export type Service = {
  id: string;
  name?: string;
  duration?: number;
  nombre?: string;
  duracion?: number;
};



type Props = {
  onSelect: (service: Service) => void;
  selectedId?: string;
};

export default function ServiceStep({ onSelect, selectedId }: Props) {
  const [servicios, setServicios] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "servicios"), (snap) => {
      setServicios(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Service)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-extrabold mb-6 tracking-tight text-gray-900 text-center">1. Elegí un servicio</h2>
      {loading ? (
        <div className="mb-4 text-lg text-gray-500">Cargando servicios...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
          {servicios.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className={`transition group w-full rounded-2xl shadow-lg px-6 py-8 flex flex-col items-center border-2 focus:outline-none focus:ring-2 focus:ring-primary-400 font-semibold text-lg cursor-pointer
                ${selectedId === s.id
                  ? 'bg-gradient-to-br from-primary-500 to-primary-400 text-white border-primary-500 scale-105 shadow-xl'
                  : 'bg-white border-gray-200 hover:scale-105 hover:border-primary-400 hover:shadow-md text-gray-900'}
              `}
              style={{ background: selectedId === s.id ? 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)' : undefined }}
            >
              <span className="font-bold text-xl mb-2 text-center">{s.nombre || s.name}</span>
              <span className={`text-sm font-normal ${selectedId === s.id ? 'text-white/80' : 'text-gray-500'}`}>{s.duracion || s.duration} min</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
// ...existing code...

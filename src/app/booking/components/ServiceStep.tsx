// Paso 1: Selección de servicio usando shadcn/ui
// import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export type Service = {
  id: string;
  name?: string;
  duration?: number;
  nombre?: string;
  duracion?: number;
  imagen?: string;
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
              className={`transition group w-full rounded-2xl p-0 border-2 focus:outline-none focus:ring-2 focus:ring-primary-400 font-semibold text-lg cursor-pointer overflow-hidden
                ${selectedId === s.id
                  ? 'bg-gradient-to-br from-primary-500 to-primary-400 text-white border-primary-500 scale-105 shadow-xl'
                  : 'bg-white border-gray-200 hover:scale-105 hover:border-primary-400 hover:shadow-md text-gray-900'}
              `}
              style={{ background: selectedId === s.id ? 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)' : undefined }}
            >
              <Card className="w-full h-[340px] flex flex-col bg-transparent border-0 shadow-none p-0 overflow-hidden">
                <div style={{height: '70%'}} className="w-full flex-shrink-0">
                  {s.imagen ? (
                    <img src={s.imagen} alt={s.nombre || s.name} className="w-full h-full object-cover rounded-t-xl" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-t-xl">
                      <PhotoIcon className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                </div>
                <CardContent className="flex flex-col items-center justify-center py-3 h-[20%] flex-1">
                  <CardTitle className="text-xl font-bold mb-1 text-center">{s.nombre || s.name}</CardTitle>
                  <CardDescription className={`text-base font-normal ${selectedId === s.id ? 'text-white/80' : 'text-gray-500'}`}>{s.duracion || s.duration} min</CardDescription>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
// ...existing code...

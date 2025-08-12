// Paso 1: Selección de servicio usando shadcn/ui
import { Button } from "@/components/ui/button";
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
    <div>
      <h2 className="text-xl font-semibold mb-4">1. Elegí un servicio</h2>
      {loading ? (
        <div className="mb-4">Cargando servicios...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {servicios.map((s) => (
            <Button
              key={s.id}
              variant={selectedId === s.id ? "default" : "outline"}
              className="flex flex-col items-center py-6"
              onClick={() => onSelect(s)}
            >
              <span className="font-bold text-lg">{s.nombre || s.name}</span>
              <span className="text-sm font-normal text-muted-foreground">
                {s.duracion || s.duration} min
              </span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
// ...existing code...

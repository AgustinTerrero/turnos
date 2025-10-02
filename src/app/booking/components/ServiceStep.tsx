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
    <div className="flex flex-col items-center justify-center">
      {loading ? (
        <div className="flex items-center gap-3 text-lg text-indigo-600">
          <div className="animate-spin h-7 w-7 border-3 border-indigo-600 border-t-transparent rounded-full"></div>
          <span className="font-medium">Cargando servicios...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {servicios.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className={`transition-all duration-500 group w-full rounded-2xl p-0 focus:outline-none font-semibold text-lg cursor-pointer overflow-hidden transform relative
                ${selectedId === s.id
                  ? 'scale-105 shadow-2xl shadow-indigo-500/50'
                  : 'hover:scale-105 hover:shadow-2xl shadow-lg'}
              `}
            >
              {/* Overlay de selección */}
              {selectedId === s.id && (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-blue-600/90 z-10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <div className="bg-white rounded-full p-3 shadow-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-indigo-600">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
              
              <Card className="w-full h-[400px] flex flex-col bg-white border-0 shadow-none p-0 overflow-hidden relative">
                {/* Imagen con efecto */}
                <div className="w-full h-[65%] flex-shrink-0 overflow-hidden relative">
                  {s.imagen ? (
                    <>
                      <img src={s.imagen} alt={s.nombre || s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 relative">
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)', backgroundSize: '32px 32px'}}></div>
                      </div>
                      <PhotoIcon className="w-24 h-24 text-gray-300 group-hover:scale-110 transition-transform duration-500 relative z-10" />
                    </div>
                  )}
                </div>
                
                {/* Contenido */}
                <CardContent className="flex flex-col items-center justify-center py-6 flex-1 bg-gradient-to-b from-white to-gray-50 relative">
                  <CardTitle className="text-xl font-bold text-center leading-tight text-gray-900 mb-2">{s.nombre || s.name}</CardTitle>
                  <CardDescription className="text-sm font-medium text-gray-600">
                    <span className="inline-flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-indigo-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-indigo-900 font-semibold">{s.duracion || s.duration} min</span>
                    </span>
                  </CardDescription>
                  
                  {/* Indicador de selección */}
                  {selectedId !== s.id && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Click para seleccionar</span>
                    </div>
                  )}
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

"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { DayPicker } from "react-day-picker";
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import "react-day-picker/dist/style.css";


type ScheduleConfigBase = {
  [key: string]: { start: string; end: string }[] | undefined;
};
type ScheduleConfig = ScheduleConfigBase & {
  bloqueados?: string[];
};

const DIAS = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

export default function HorarioConfig() {
  const [config, setConfig] = useState<ScheduleConfig | null>(null);
  const [loading, setLoading] = useState(true);
  // Para selección múltiple de feriados

  // Eliminada lógica de abrir/cerrar calendario, ya no es necesaria

  useEffect(() => {
    try {
      const ref = doc(db, "schedule_config", "main");
      const unsub = onSnapshot(
        ref,
        (snap) => {
          setConfig(snap.exists() ? snap.data() as ScheduleConfig : {});
          setLoading(false);
        },
        (error) => {
          console.error("Error loading schedule config:", error);
          setLoading(false);
        }
      );
      return () => unsub();
    } catch (error) {
      console.error("Error setting up schedule config listener:", error);
      setLoading(false);
    }
  }, []);

  // Guardar automáticamente los feriados al cambiar
  const handleSave = async (newConfig: ScheduleConfig) => {
    const ref = doc(db, "schedule_config", "main");
    await setDoc(ref, newConfig);
    toast.success("Feriados actualizados");
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      <span className="ml-3 text-gray-600 font-medium">Cargando configuración...</span>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Sección de horarios */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b-2 border-gray-200">
          <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Horarios de Atención
          </h3>
          <p className="text-sm text-indigo-700 mt-1">Define tu horario de trabajo para cada día de la semana</p>
        </div>
        
        <div className="p-6">
          <div className="grid gap-3 max-w-2xl">
            {DIAS.map((dia) => (
              <div
                key={dia}
                className="flex items-center gap-3 bg-gray-50 rounded-xl py-3 px-4 border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
              >
                <label className="font-bold capitalize min-w-[90px] text-gray-900 select-none">
                  {dia}
                </label>
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="time"
                    value={config ? config[dia]?.[0]?.start || "" : ""}
                    onChange={e => {
                      setConfig((c) => ({
                        ...c,
                        [dia]: [{
                          start: e.target.value,
                          end: c && c[dia]?.[0]?.end || ""
                        }]
                      }));
                    }}
                    className="flex-1 max-w-[140px] text-center rounded-lg bg-white border-2 border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all font-semibold text-gray-900"
                  />
                  <span className="text-gray-400 font-bold">→</span>
                  <Input
                    type="time"
                    value={config ? config[dia]?.[0]?.end || "" : ""}
                    onChange={e => {
                      setConfig((c) => ({
                        ...c,
                        [dia]: [{
                          start: c && c[dia]?.[0]?.start || "",
                          end: e.target.value
                        }]
                      }));
                    }}
                    className="flex-1 max-w-[140px] text-center rounded-lg bg-white border-2 border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all font-semibold text-gray-900"
                  />
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            className="mt-6 w-full max-w-xs bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-xl py-3 shadow-lg hover:shadow-xl transition-all"
            onClick={() => {
              if (config) handleSave(config);
            }}
          >
            💾 Guardar Horarios
          </Button>
        </div>
      </div>

      {/* Sección de días bloqueados */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b-2 border-gray-200">
          <h3 className="text-xl font-bold text-red-900 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            Días Bloqueados (Feriados)
          </h3>
          <p className="text-sm text-red-700 mt-1">Marca los días en que no habrá atención</p>
        </div>
        
        <div className="p-6">
          {/* Lista de días bloqueados */}
          {(config?.bloqueados && config.bloqueados.length > 0) && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Días bloqueados actuales:</h4>
              <div className="flex gap-2 flex-wrap">
                {config.bloqueados.map((fecha: string) => (
                  <span 
                    key={fecha} 
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-red-200 text-red-700 rounded-xl px-3 py-2 text-sm font-semibold shadow-sm border-2 border-red-300 hover:shadow-md transition-all"
                  >
                    📅 {fecha}
                    <button
                      type="button"
                      className="ml-1 hover:bg-red-300 rounded-full p-0.5 transition-colors"
                      onClick={() => {
                        const newBloqueados = (config?.bloqueados || []).filter((f: string) => f !== fecha);
                        const newConfig = { ...config, bloqueados: newBloqueados } as ScheduleConfig;
                        setConfig(newConfig);
                        handleSave(newConfig);
                      }}
                      aria-label="Eliminar feriado"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Calendario */}
          <div className="flex flex-col items-center">
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 inline-block">
              <DayPicker
                mode="multiple"
                selected={(config?.bloqueados || []).map(f => {
                  const [year, month, day] = f.split('-').map(Number);
                  return new Date(year, month - 1, day);
                })}
                onSelect={(dates) => {
                  const bloqueados = (dates || []).map(d => format(d, 'yyyy-MM-dd'));
                  const newConfig = { ...config, bloqueados } as ScheduleConfig;
                  setConfig(newConfig);
                  handleSave(newConfig);
                }}
                showOutsideDays
                weekStartsOn={1}
                locale={es}
                className="rounded-xl"
                styles={{
                  day_selected: { 
                    backgroundColor: '#ef4444', 
                    color: 'white',
                    fontWeight: 'bold'
                  },
                  day_today: { 
                    border: '2px solid #6366f1',
                    fontWeight: 'bold'
                  },
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center max-w-md">
              💡 Haz clic en las fechas del calendario para marcarlas como bloqueadas. Los cambios se guardan automáticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

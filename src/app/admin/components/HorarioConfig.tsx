"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

import { Card } from "@/components/ui/card";
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

  if (loading) return <div>Cargando configuración...</div>;

  return (
    <Card className="mt-8 p-0 bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] shadow-xl border border-[#e5e7eb] max-w-md w-full mx-auto sm:rounded-2xl rounded-none sm:my-8 my-0">
      <h2 className="text-xl font-semibold mb-6 pt-6 text-center tracking-tight text-gray-900 sm:text-xl text-lg">Configurar horarios</h2>
      <form className="flex flex-col gap-6 px-2 pb-6 sm:px-6">
        <div className="flex flex-col gap-3 w-full">
          {DIAS.map((dia) => (
            <div
              key={dia}
              className="flex items-center justify-center gap-2 bg-white/80 rounded-xl py-2 px-2 shadow-sm border border-[#e5e7eb] hover:shadow-md transition-all w-full sm:gap-3 sm:px-3"
            >
              <label className="font-medium capitalize w-20 text-right mr-1 text-gray-700 select-none tracking-wide text-xs sm:w-24 sm:text-base sm:mr-2">
                {dia}:
              </label>
              <Input
                type="text"
                value={config ? config[dia]?.[0]?.start || "" : ""}
                placeholder="Ej: 09:00"
                onChange={e => {
                  setConfig((c) => ({
                    ...c,
                    [dia]: [{
                      start: e.target.value,
                      end: c && c[dia]?.[0]?.end || ""
                    }]
                  }));
                }}
                className="w-20 text-center rounded-lg bg-[#f1f5f9] border border-[#d1d5db] focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1] transition-all font-semibold text-gray-900 placeholder-gray-400 shadow-inner text-xs sm:w-24 sm:text-base"
              />
              <span className="mx-1 text-gray-400 font-bold text-base sm:text-lg">a</span>
              <Input
                type="text"
                value={config ? config[dia]?.[0]?.end || "" : ""}
                placeholder="Ej: 18:00"
                onChange={e => {
                  setConfig((c) => ({
                    ...c,
                    [dia]: [{
                      start: c && c[dia]?.[0]?.start || "",
                      end: e.target.value
                    }]
                  }));
                }}
                className="w-20 text-center rounded-lg bg-[#f1f5f9] border border-[#d1d5db] focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1] transition-all font-semibold text-gray-900 placeholder-gray-400 shadow-inner text-xs sm:w-24 sm:text-base"
              />
            </div>
          ))}
        </div>

                {/* Botón para guardar horarios */}
        <Button
          type="button"
          className="mt-2 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl py-2 shadow transition-all"
          onClick={() => {
            if (config) handleSave(config);
          }}
        >
          Guardar horarios
        </Button>

        {/* Bloqueo de días específicos */}
        <div className="mt-8">
          <h3 className="font-semibold mb-3 text-gray-800 text-center text-base sm:text-lg">Días bloqueados <span className="font-normal text-gray-500">(feriados)</span>:</h3>
          <div className="flex gap-2 mb-3 flex-wrap justify-center">
            {(config && config.bloqueados ? config.bloqueados : []).map((fecha: string) => (
              <span key={fecha} className="inline-flex items-center bg-gradient-to-r from-red-100 to-red-200 text-red-700 rounded-full px-3 py-1 text-xs font-medium shadow-sm border border-red-200 mb-2">
                {fecha}
                <button
                  type="button"
                  className="ml-2 text-red-400 hover:text-red-600 font-bold text-base"
                  onClick={() => {
                    const newBloqueados = (config?.bloqueados || []).filter((f: string) => f !== fecha);
                    const newConfig = { ...config, bloqueados: newBloqueados } as ScheduleConfig;
                    setConfig(newConfig);
                    handleSave(newConfig);
                  }}
                  aria-label="Eliminar feriado"
                >✕</button>
              </span>
            ))}
          </div>
          <div className="flex flex-col items-center">
            <DayPicker
              mode="multiple"
              selected={(config?.bloqueados || []).map(f => {
                const [year, month, day] = f.split('-').map(Number);
                return new Date(year, month - 1, day);
              })}
              onSelect={(dates) => {
                // Convertir fechas a string yyyy-MM-dd en zona local
                const bloqueados = (dates || []).map(d => format(d, 'yyyy-MM-dd'));
                const newConfig = { ...config, bloqueados } as ScheduleConfig;
                setConfig(newConfig);
                handleSave(newConfig);
              }}
              showOutsideDays
              weekStartsOn={1}
              locale={es}
              className="rounded-xl border border-gray-200 shadow-sm bg-white"
              styles={{
                day_selected: { backgroundColor: '#f87171', color: 'white' },
                day_today: { border: '1.5px solid #6366f1' },
              }}
            />
          </div>
        </div>
      </form>
    </Card>
  );
}

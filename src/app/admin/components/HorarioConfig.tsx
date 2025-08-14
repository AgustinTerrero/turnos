"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const DIAS = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

export default function HorarioConfig() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Cerrar calendario al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }
    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar]);

  useEffect(() => {
    const ref = doc(db, "schedule_config", "main");
    const unsub = onSnapshot(ref, (snap) => {
      setConfig(snap.exists() ? snap.data() : {});
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSave = async () => {
    const ref = doc(db, "schedule_config", "main");
    await setDoc(ref, config);
    toast.success("Configuración guardada");
  };

  if (loading) return <div>Cargando configuración...</div>;

  return (
  <Card className="mt-8 p-0 bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] shadow-xl border border-[#e5e7eb] max-w-md w-full mx-auto sm:rounded-2xl rounded-none sm:my-8 my-0">
  <h2 className="text-xl font-semibold mb-6 pt-6 text-center tracking-tight text-gray-900 sm:text-xl text-lg">Configurar horarios</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSave();
        }}
        className="flex flex-col gap-6 px-2 pb-6 sm:px-6"
      >
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
                value={config[dia]?.[0]?.start || ""}
                placeholder="Ej: 09:00"
                onChange={e => {
                  setConfig((c: any) => ({
                    ...c,
                    [dia]: [{
                      start: e.target.value,
                      end: c[dia]?.[0]?.end || ""
                    }]
                  }));
                }}
                className="w-20 text-center rounded-lg bg-[#f1f5f9] border border-[#d1d5db] focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1] transition-all font-semibold text-gray-900 placeholder-gray-400 shadow-inner text-xs sm:w-24 sm:text-base"
              />
              <span className="mx-1 text-gray-400 font-bold text-base sm:text-lg">a</span>
              <Input
                type="text"
                value={config[dia]?.[0]?.end || ""}
                placeholder="Ej: 18:00"
                onChange={e => {
                  setConfig((c: any) => ({
                    ...c,
                    [dia]: [{
                      start: c[dia]?.[0]?.start || "",
                      end: e.target.value
                    }]
                  }));
                }}
                className="w-20 text-center rounded-lg bg-[#f1f5f9] border border-[#d1d5db] focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1] transition-all font-semibold text-gray-900 placeholder-gray-400 shadow-inner text-xs sm:w-24 sm:text-base"
              />
            </div>
          ))}
        </div>

        {/* Bloqueo de días específicos */}
        <div className="mt-8">
          <h3 className="font-semibold mb-3 text-gray-800 text-center text-base sm:text-lg">Días bloqueados <span className="font-normal text-gray-500">(feriados)</span>:</h3>
          <div className="flex gap-2 mb-3 flex-wrap justify-center">
            {(config.bloqueados || []).map((fecha: string, i: number) => (
              <span key={fecha} className="inline-flex items-center bg-gradient-to-r from-red-100 to-red-200 text-red-700 rounded-full px-3 py-1 text-xs font-medium shadow-sm border border-red-200 mb-2">
                {fecha}
                <button
                  type="button"
                  className="ml-2 text-red-400 hover:text-red-600 font-bold text-base"
                  onClick={() => {
                    setConfig((c: any) => ({
                      ...c,
                      bloqueados: c.bloqueados.filter((f: string) => f !== fecha)
                    }));
                  }}
                  aria-label="Eliminar feriado"
                >✕</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 items-center justify-center flex-wrap relative">
            <button
              type="button"
              className="w-32 sm:w-40 rounded-lg bg-[#f1f5f9] border border-[#d1d5db] px-3 py-2 text-left font-semibold text-gray-900 placeholder-gray-400 shadow-inner text-xs sm:text-base focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1] transition-all"
              onClick={() => setShowCalendar((v) => !v)}
            >
              {selectedDate ?
                selectedDate.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }) :
                <span className="text-gray-400">dd/mm/aaaa</span>
              }
            </button>
            {showCalendar && (
              <div ref={calendarRef} className="absolute z-20 top-12 left-0 bg-white rounded-xl shadow-xl border border-gray-200 p-2 animate-fade-in">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date)}
                  weekStartsOn={1}
                  /* Para español, se puede instalar date-fns/locale/es y pasar locale={es} si se requiere. */
                  modifiersClassNames={{
                    selected: "bg-[#6366f1] text-white",
                    today: "border border-[#6366f1]"
                  }}
                />
              </div>
            )}
            <Button
              type="button"
              className="rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold shadow-md px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-base transition-all"
              onClick={() => {
                if (selectedDate) {
                  const value = selectedDate.toISOString().slice(0, 10);
                  setConfig((c: any) => ({
                    ...c,
                    bloqueados: [...(c.bloqueados || []), value]
                  }));
                  setSelectedDate(undefined);
                  setShowCalendar(false);
                }
              }}
            >Agregar día</Button>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            type="submit"
            className="rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold shadow-lg px-6 py-2 text-base sm:px-8 transition-all w-full max-w-xs"
          >
            Guardar cambios
          </Button>
        </div>
      </form>
    </Card>
  );
}

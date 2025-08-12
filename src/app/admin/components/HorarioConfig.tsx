"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DIAS = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

export default function HorarioConfig() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    alert("Configuración guardada");
  };

  if (loading) return <div>Cargando configuración...</div>;

  return (
    <Card className="mt-8 p-6">
      <h2 className="text-lg font-bold mb-4">Configurar horarios</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-4"
      >
        {DIAS.map((dia) => (
          <div key={dia} className="mb-2">
            <label className="font-semibold capitalize mr-2">{dia}:</label>
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
              className="w-28 inline-block mr-2"
            />
            <span className="mx-1">a</span>
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
              className="w-28 inline-block"
            />
          </div>
        ))}

        {/* Bloqueo de días específicos */}
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Días bloqueados (feriados):</h3>
          <div className="flex gap-2 mb-2 flex-wrap">
            {(config.bloqueados || []).map((fecha: string, i: number) => (
              <span key={fecha} className="inline-flex items-center bg-red-100 text-red-700 rounded px-2 py-1 text-xs mr-2 mb-2">
                {fecha}
                <button
                  type="button"
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => {
                    setConfig((c: any) => ({
                      ...c,
                      bloqueados: c.bloqueados.filter((f: string) => f !== fecha)
                    }));
                  }}
                >✕</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <Input
              type="date"
              className="w-40"
              id="nuevo-bloqueado"
            />
            <Button
              type="button"
              onClick={() => {
                const input = document.getElementById('nuevo-bloqueado') as HTMLInputElement;
                if (input && input.value) {
                  setConfig((c: any) => ({
                    ...c,
                    bloqueados: [...(c.bloqueados || []), input.value]
                  }));
                  input.value = "";
                }
              }}
            >Agregar día</Button>
          </div>
        </div>

        <div className="mt-6">
          <Button type="submit">Guardar cambios</Button>
        </div>
      </form>
    </Card>
  );
}

"use client";
// Esqueleto del panel de administración

import React, { useState } from 'react';
import TurnosTable from './TurnosTable';

import HorarioConfig from './HorarioConfig';
import ServiciosManager from './ServiciosManager';

export default function AdminPanel() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Panel de Turnos</h1>
        <button
          className="px-4 py-2 rounded bg-muted text-sm border hover:bg-accent transition"
          onClick={() => setShowSettings((v) => !v)}
        >
          {showSettings ? '← Volver' : 'Ajustes'}
        </button>
      </div>
      {showSettings ? (
        <div className="rounded-lg border p-4 bg-white shadow">
          <h2 className="text-lg font-semibold mb-2">Configuración de horarios y servicios</h2>
          <HorarioConfig />
          <ServiciosManager />
        </div>
      ) : (
        <div className="rounded-lg border p-4 bg-white shadow">
          <TurnosTable />
        </div>
      )}
    </div>
  );
}

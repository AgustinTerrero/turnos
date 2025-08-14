"use client";
// Esqueleto del panel de administración

import React, { useState } from 'react';
import { ArrowLeftIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import TurnosTable from './TurnosTable';

import HorarioConfig from './HorarioConfig';
import ServiciosManager from './ServiciosManager';

export default function AdminPanel() {
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'horarios' | 'servicios'>('horarios');

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start" style={{
      background: 'linear-gradient(120deg, #f0f4ff 0%, #e0e7ff 40%, #f5f7fa 100%)',
      minHeight: '100vh',
    }}>
      <div className="w-full max-w-5xl px-2 sm:px-4 md:px-8 py-6 md:py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm text-center sm:text-left">Panel de Turnos</h1>
          <button
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-white/80 border border-gray-200 shadow text-primary-700 font-semibold text-base hover:bg-primary-50 transition flex items-center gap-2 justify-center"
            onClick={() => setShowSettings((v) => !v)}
          >
            {showSettings ? (
              <>
                <ArrowLeftIcon className="w-5 h-5" />
                Volver
              </>
            ) : (
              <>
                <Cog6ToothIcon className="w-5 h-5" />
                Ajustes
              </>
            )}
          </button>
        </div>
        <div className="transition-all duration-300">
          {showSettings ? (
            <div className="rounded-2xl border border-gray-200 p-2 sm:p-4 md:p-6 bg-white/90 shadow-xl">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-primary-700">Configuración</h2>
              <div className="flex gap-2 mb-6 justify-center">
                <button
                  className={`px-4 py-2 rounded-lg font-semibold transition-all text-base shadow-sm border ${settingsTab === 'horarios' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                  onClick={() => setSettingsTab('horarios')}
                >
                  Horarios
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-semibold transition-all text-base shadow-sm border ${settingsTab === 'servicios' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                  onClick={() => setSettingsTab('servicios')}
                >
                  Servicios
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm">
                {settingsTab === 'horarios' ? <HorarioConfig /> : <ServiciosManager />}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 p-2 sm:p-4 md:p-6 bg-white/90 shadow-xl overflow-x-auto">
              <TurnosTable />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

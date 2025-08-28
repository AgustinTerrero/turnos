"use client";
// Esqueleto del panel de administración

import React, { useState, useEffect } from 'react';
// Definir el tipo Turno para el estado
export interface Turno {
  id: string;
  service: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  wantsWhatsappReminder?: boolean;
  status?: 'pendiente' | 'confirmado' | 'cancelado';
}
import dayjs from 'dayjs';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ArrowLeftIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import TurnosTable from './TurnosTable';
function DashboardResumen({ turnos, loading }: { turnos: Turno[], loading: boolean }) {
  const hoy = dayjs().format('YYYY-MM-DD');
  const turnosHoy = turnos.filter(t => t.date === hoy);
  const proximoTurno = turnos
    .filter(t => dayjs(`${t.date} ${t.time}`).isAfter(dayjs()))
    .sort((a, b) => dayjs(`${a.date} ${a.time}`).unix() - dayjs(`${b.date} ${b.time}`).unix())[0];
  const confirmados = turnos.filter(t => t.status === 'confirmado').length;
  const cancelados = turnos.filter(t => t.status === 'cancelado').length;

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <div className="flex-1 min-w-[180px] bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col items-start shadow-sm">
        <span className="text-xs text-blue-700 font-semibold mb-1">📊 Turnos de hoy</span>
        <span className="text-2xl font-bold text-blue-900">{loading ? '--' : turnosHoy.length}</span>
      </div>
      <div className="flex-1 min-w-[180px] bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex flex-col items-start shadow-sm">
        <span className="text-xs text-indigo-700 font-semibold mb-1">⏳ Próximo turno</span>
        <span className="text-base font-bold text-indigo-900">{loading ? '--' : proximoTurno ? `${proximoTurno.date} ${proximoTurno.time} - ${proximoTurno.name}` : 'Sin próximos'}</span>
      </div>
      <div className="flex-1 min-w-[180px] bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col items-start shadow-sm">
        <span className="text-xs text-green-700 font-semibold mb-1">✅ Confirmados vs cancelados</span>
        <span className="text-base font-bold text-green-900">{loading ? '--' : `${confirmados} / ${cancelados}`}</span>
      </div>
    </div>
  );
}
import HorarioConfig from './HorarioConfig';
import ServiciosManager from './ServiciosManager';

export default function AdminPanel() {
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'horarios' | 'servicios'>('horarios');
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setTurnos(
        snap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            service: data.service || '',
            date: data.date || '',
            time: data.time || '',
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            wantsWhatsappReminder: data.wantsWhatsappReminder || false,
            status: data.status || 'pendiente',
          };
        })
      );
      setLoading(false);
    });
    return () => unsub();
  }, []);

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
                {/* Dashboard resumen */}
                <DashboardResumen turnos={turnos} loading={loading} />
                <TurnosTable turnos={turnos} loading={loading} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

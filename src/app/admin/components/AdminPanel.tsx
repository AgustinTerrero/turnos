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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 flex flex-col items-start shadow-lg hover:shadow-xl transition-shadow text-white">
        <div className="flex items-center justify-between w-full mb-3">
          <span className="text-sm font-medium opacity-90">Turnos de hoy</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-80">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        </div>
        <span className="text-4xl font-bold">{loading ? '--' : turnosHoy.length}</span>
      </div>
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 flex flex-col items-start shadow-lg hover:shadow-xl transition-shadow text-white">
        <div className="flex items-center justify-between w-full mb-3">
          <span className="text-sm font-medium opacity-90">Próximo turno</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-80">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="text-base font-semibold truncate w-full">{loading ? '--' : proximoTurno ? `${proximoTurno.date} ${proximoTurno.time}` : 'Sin próximos'}</span>
        {proximoTurno && <span className="text-sm opacity-90 mt-1">{proximoTurno.name}</span>}
      </div>
      <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 flex flex-col items-start shadow-lg hover:shadow-xl transition-shadow text-white">
        <div className="flex items-center justify-between w-full mb-3">
          <span className="text-sm font-medium opacity-90">Estado</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-80">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{loading ? '--' : confirmados}</span>
          <span className="text-lg opacity-90">confirmados</span>
        </div>
        <span className="text-sm opacity-90 mt-1">{loading ? '--' : cancelados} cancelados</span>
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-1">Panel de Administración</h1>
            <p className="text-gray-600 text-base">Gestioná turnos, horarios y servicios</p>
          </div>
          <button
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold text-base hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 justify-center transform hover:scale-105"
            onClick={() => setShowSettings((v) => !v)}
          >
            {showSettings ? (
              <>
                <ArrowLeftIcon className="w-5 h-5" />
                Volver a Turnos
              </>
            ) : (
              <>
                <Cog6ToothIcon className="w-5 h-5" />
                Configuración
              </>
            )}
          </button>
        </div>
        <div className="transition-all duration-300">
          {showSettings ? (
            <div className="rounded-2xl bg-white shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Cog6ToothIcon className="w-7 h-7" />
                  Configuración
                </h2>
              </div>
              <div className="flex gap-0 border-b border-gray-200">
                <button
                  className={`flex-1 px-6 py-4 font-semibold transition-all text-base relative ${settingsTab === 'horarios' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setSettingsTab('horarios')}
                >
                  Horarios y Feriados
                  {settingsTab === 'horarios' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600"></div>}
                </button>
                <button
                  className={`flex-1 px-6 py-4 font-semibold transition-all text-base relative ${settingsTab === 'servicios' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setSettingsTab('servicios')}
                >
                  Servicios
                  {settingsTab === 'servicios' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600"></div>}
                </button>
              </div>
              <div className="p-6 sm:p-8 bg-gray-50">
                {settingsTab === 'horarios' ? <HorarioConfig /> : <ServiciosManager />}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white shadow-2xl overflow-hidden">
              <div className="p-6 sm:p-8">
                {/* Dashboard resumen */}
                <DashboardResumen turnos={turnos} loading={loading} />
                <TurnosTable turnos={turnos} loading={loading} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

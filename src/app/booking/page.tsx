// Página de reserva de turnos (wizard)
"use client";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const BookingWizard = dynamic(() => import('./components/BookingWizard'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-white">Cargando sistema de reservas...</p>
      </div>
    </div>
  ),
});

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <BookingWizard />
    </Suspense>
  );
}

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function BookingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error en booking:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-white/20">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-10 h-10 text-red-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Error al cargar reservas
          </h1>
          <p className="text-gray-600 text-sm">
            No pudimos cargar el sistema de reservas. Por favor, intenta nuevamente.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={reset}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg"
          >
            Reintentar
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="w-full py-3 rounded-xl font-semibold border-2 transition-all hover:scale-105"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}

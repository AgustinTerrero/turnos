"use client";
// Esqueleto del wizard de reservas
import React, { useState } from 'react';
import ServiceStep, { Service } from './ServiceStep';
import DateStep from './DateStep';
import TimeStep from './TimeStep';
import DetailsStep from './DetailsStep';
import ConfirmStep from './ConfirmStep';
import StepBar from './StepBar';

type WizardState = {
  service: Service | null;
  date: string | null;
  time: string | null;
  name?: string;
  phone?: string;
  wantsWhatsappReminder?: boolean;
};


const BookingWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>({ service: null, date: null, time: null });
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Configuración de pasos y opciones elegidas
  const steps = ["Servicio", "Fecha", "Hora", "Datos", "Confirmación"];
  // completedSteps sólo hasta el paso anterior al actual
  const completedSteps: { [key: number]: boolean } = {
    1: step > 1 && !!state.service,
    2: step > 2 && !!state.date,
    3: step > 3 && !!state.time,
    4: step > 4 && !!state.name && !!state.phone,
    5: step > 5 && saved,
  };
  const chosenOptions: { [key: number]: string } = {
    1: state.service?.nombre || state.service?.name || "",
    2: state.date ? state.date.split("-").reverse().join("/") : "",
    3: state.time || "",
    4: state.name || "",
  };

  // Paso 1: Selección de servicio
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Header elegante */}
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
              Reservá tu <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">turno</span>
            </h1>
            <p className="text-gray-300 text-lg">Simple, rápido y profesional</p>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 border border-white/20">
            <StepBar steps={steps} currentStep={step} completedSteps={completedSteps} chosenOptions={chosenOptions} />
            <div className="mt-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                  1
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Elegí tu servicio</h2>
                  <p className="text-gray-500 text-sm">Seleccioná la opción que mejor se adapte a tus necesidades</p>
                </div>
              </div>
              <ServiceStep
                selectedId={state.service?.id}
                onSelect={(service) => {
                  setState((s) => ({ ...s, service }));
                  setStep(2);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Paso 2: Selección de fecha
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
              Reservá tu <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">turno</span>
            </h1>
            <p className="text-gray-300 text-lg">Simple, rápido y profesional</p>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 border border-white/20">
            <StepBar steps={steps} currentStep={step} completedSteps={completedSteps} chosenOptions={chosenOptions} />
            <div className="mt-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                  2
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Elegí la fecha</h2>
                  <p className="text-gray-500 text-sm">Seleccioná el día que mejor te venga</p>
                </div>
              </div>
              <DateStep
                selectedDate={state.date || undefined}
                onSelect={(date) => {
                  setState((s) => ({ ...s, date }));
                  setStep(3);
                }}
                onBack={() => setStep(1)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Paso 3: Selección de horario
  if (step === 3 && state.date) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
              Reservá tu <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">turno</span>
            </h1>
            <p className="text-gray-300 text-lg">Simple, rápido y profesional</p>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 border border-white/20">
            <StepBar steps={steps} currentStep={step} completedSteps={completedSteps} chosenOptions={chosenOptions} />
            <div className="mt-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                  3
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Elegí el horario</h2>
                  <p className="text-gray-500 text-sm">Seleccioná el horario que mejor se adapte a tu agenda</p>
                </div>
              </div>
              <TimeStep
                date={state.date}
                selectedTime={state.time || undefined}
                onSelect={(time) => {
                  setState((s) => ({ ...s, time }));
                  setStep(4);
                }}
                onBack={() => setStep(2)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Paso 4: Formulario de datos
  if (step === 4 && state.service && state.date && state.time) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
              Reservá tu <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">turno</span>
            </h1>
            <p className="text-gray-300 text-lg">Simple, rápido y profesional</p>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 border border-white/20">
            <StepBar steps={steps} currentStep={step} completedSteps={completedSteps} chosenOptions={chosenOptions} />
            <div className="mt-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                  4
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Tus datos</h2>
                  <p className="text-gray-500 text-sm">Completá tu información de contacto</p>
                </div>
              </div>
              <DetailsStep
          defaultValues={{ name: state.name || '', phone: state.phone || '' }}
          onSubmit={async ({ name, phone, wantsWhatsappReminder }) => {
            setSaving(true);
            setError(null);
            try {
              const { db } = await import("@/lib/firebase");
              const { addDoc, collection } = await import("firebase/firestore");
              const serviceName = state.service?.nombre || state.service?.name || '';
              await addDoc(collection(db, 'appointments'), {
                service: serviceName,
                serviceId: state.service?.id,
                date: state.date,
                time: state.time,
                name,
                phone,
                wantsWhatsappReminder,
                createdAt: new Date()
              });
              setState((s) => ({ ...s, name, phone, wantsWhatsappReminder }));
              setSaved(true);
              setStep(5);
            } catch (e) {
              console.error('Error al guardar el turno:', e);
              setError('Error al guardar el turno. Intenta nuevamente.');
            } finally {
              setSaving(false);
            }
          }}
          onBack={() => setStep(3)}
        />
        {saving && (
          <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-3 border-indigo-600 border-t-transparent rounded-full"></div>
            <span className="text-indigo-700 font-medium">Guardando tu turno...</span>
          </div>
        )}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Paso 5: Confirmación
  if (step === 5 && state.service && state.date && state.time && state.name && state.phone && saved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 border border-white/20">
            <StepBar steps={steps} currentStep={step} completedSteps={completedSteps} chosenOptions={chosenOptions} />
            <div className="mt-10">
              <ConfirmStep
          service={state.service.nombre || state.service.name || ''}
          date={state.date}
          time={state.time}
          name={state.name}
          phone={state.phone}
          wantsWhatsappReminder={state.wantsWhatsappReminder}
          onNew={() => {
            setState({ service: null, date: null, time: null });
            setSaved(false);
            setStep(1);
          }}
        />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default BookingWizard;

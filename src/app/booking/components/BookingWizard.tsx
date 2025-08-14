"use client";
// Esqueleto del wizard de reservas
import React, { useState } from 'react';
import ServiceStep, { Service } from './ServiceStep';
import DateStep from './DateStep';
import TimeStep from './TimeStep';
import DetailsStep from './DetailsStep';
import ConfirmStep from './ConfirmStep';

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

  // Paso 1: Selección de servicio
  if (step === 1) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Reservá tu turno</h1>
        <ServiceStep
          selectedId={state.service?.id}
          onSelect={(service) => {
            setState((s) => ({ ...s, service }));
            setStep(2);
          }}
        />
      </div>
    );
  }

  // Paso 2: Selección de fecha
  if (step === 2) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Reservá tu turno</h1>
        <DateStep
          selectedDate={state.date || undefined}
          onSelect={(date) => {
            setState((s) => ({ ...s, date }));
            setStep(3);
          }}
          onBack={() => setStep(1)}
        />
      </div>
    );
  }

  // Paso 3: Selección de horario
  if (step === 3 && state.date) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Reservá tu turno</h1>
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
    );
  }

  // Paso 4: Formulario de datos
  if (step === 4 && state.service && state.date && state.time) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Reservá tu turno</h1>
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
        {saving && <div className="mt-4 text-sm text-muted-foreground">Guardando turno...</div>}
        {error && <div className="mt-4 text-sm text-red-500">{error}</div>}
      </div>
    );
  }

  // Paso 5: Confirmación
  if (step === 5 && state.service && state.date && state.time && state.name && state.phone && saved) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Reservá tu turno</h1>
        <ConfirmStep
          service={state.service.name || ''}
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
    );
  }

  return null;
};

export default BookingWizard;

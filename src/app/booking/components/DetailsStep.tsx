// Paso 4: Formulario de datos del usuario
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";

type Props = {
  onSubmit: (data: { name: string; phone: string; wantsWhatsappReminder: boolean }) => void;
  onBack: () => void;
  defaultValues?: { name: string; phone: string };
};

export default function DetailsStep({ onSubmit, onBack, defaultValues }: Props) {
  const [name, setName] = useState(defaultValues?.name || "");
  const [phone, setPhone] = useState(defaultValues?.phone || "");
  const [wantsWhatsappReminder, setWantsWhatsappReminder] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  // Validación simple de teléfono (puedes ajustar la regex para tu país)
  const phoneValid = /^\+?\d{7,15}$/.test(phone.replace(/\s|-/g, ""));

  return (
    <div className="flex justify-center items-center">
      <form
        className="bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-3xl px-8 sm:px-12 py-12 max-w-lg w-full border-2 border-gray-100"
        onSubmit={e => {
          e.preventDefault();
          if (!phoneValid) return;
          onSubmit({ name, phone, wantsWhatsappReminder });
        }}
      >
        <div className="space-y-6 mb-8">
          {/* Campo Nombre */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              Nombre completo
            </label>
            <Input
              placeholder="Juan Pérez"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="rounded-xl bg-white border-2 border-gray-200 px-5 py-4 text-base focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all shadow-sm"
            />
          </div>

          {/* Campo Teléfono */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              Teléfono
            </label>
            <div className="relative">
              <Input
                placeholder="+54 9 11 2233 4455"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onBlur={() => setPhoneTouched(true)}
                required
                className={`rounded-xl bg-white border-2 px-5 py-4 text-base focus:ring-4 transition-all shadow-sm ${
                  phoneTouched && !phoneValid 
                    ? 'border-red-400 ring-4 ring-red-100 focus:border-red-400' 
                    : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-400'
                }`}
              />
              {phone && phoneTouched && (
                <span className={`absolute right-4 top-1/2 -translate-y-1/2`}>
                  {phoneValid ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-emerald-500">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-400">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
              )}
            </div>
            {phoneTouched && !phoneValid && (
              <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span>Ingresá un teléfono válido (ej: +5491122334455)</span>
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp reminder */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5 mb-8">
          <div className="flex items-start gap-4">
            <Switch 
              id="whatsapp-reminder" 
              checked={wantsWhatsappReminder} 
              onCheckedChange={setWantsWhatsappReminder}
              className="mt-1"
            />
            <label htmlFor="whatsapp-reminder" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-green-600">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
                </svg>
                <span className="text-base font-semibold text-gray-900">Recordatorio por WhatsApp</span>
              </div>
              <p className="text-sm text-gray-600">Te enviaremos un mensaje antes de tu turno</p>
            </label>
          </div>
        </div>

        {/* Botones */}
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            type="button" 
            onClick={onBack} 
            className="flex-1 py-4 rounded-xl text-base font-semibold bg-gray-100 hover:bg-gray-200 border-2 border-gray-200 text-gray-700 transition-all hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Volver
          </Button>
          <Button
            type="submit"
            className="flex-1 py-4 rounded-xl text-base font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            disabled={!phoneValid || !name}
          >
            Confirmar reserva
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline ml-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </Button>
        </div>
      </form>
    </div>
  );
}

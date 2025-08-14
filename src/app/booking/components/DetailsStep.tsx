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

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <form
        className="bg-white shadow-xl rounded-2xl px-8 py-10 max-w-md w-full text-center border border-gray-100"
        onSubmit={e => {
          e.preventDefault();
          onSubmit({ name, phone, wantsWhatsappReminder });
        }}
      >
        <h2 className="text-2xl font-extrabold mb-6 tracking-tight text-gray-900">4. Tus datos</h2>
        <div className="space-y-5 mb-6">
          <Input
            placeholder="Nombre"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-base focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition"
          />
          <Input
            placeholder="Teléfono"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-base focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition"
          />
        </div>
        <div className="flex items-center justify-center gap-3 mb-8">
          <Switch id="whatsapp-reminder" checked={wantsWhatsappReminder} onCheckedChange={setWantsWhatsappReminder} />
          <label htmlFor="whatsapp-reminder" className="text-base text-gray-700 select-none">Quiero recibir recordatorio por WhatsApp</label>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Button variant="secondary" type="button" onClick={onBack} className="w-1/2 py-3 rounded-lg text-base font-semibold bg-gray-100 text-primary-700 hover:bg-gray-200">
            ← Volver
          </Button>
          <Button
            type="submit"
            className="w-1/2 py-3 rounded-lg text-base font-semibold bg-primary-500 text-white hover:bg-primary-600 transition"
            style={{ background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)', color: '#fff', border: 'none' }}
          >
            Reservar turno
          </Button>
        </div>
      </form>
    </div>
  );
}

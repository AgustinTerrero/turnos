// Paso 4: Formulario de datos del usuario
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

type Props = {
  onSubmit: (data: { name: string; email: string; phone: string }) => void;
  onBack: () => void;
  defaultValues?: { name: string; email: string; phone: string };
};

export default function DetailsStep({ onSubmit, onBack, defaultValues }: Props) {
  const [name, setName] = useState(defaultValues?.name || "");
  const [email, setEmail] = useState(defaultValues?.email || "");
  const [phone, setPhone] = useState(defaultValues?.phone || "");

  return (
    <form
      className="space-y-4"
      onSubmit={e => {
        e.preventDefault();
        onSubmit({ name, email, phone });
      }}
    >
      <h2 className="text-xl font-semibold mb-4">4. Tus datos</h2>
      <Input
        placeholder="Nombre"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <Input
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <Input
        placeholder="Teléfono"
        type="tel"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        required
      />
      <div className="flex gap-2 mt-4">
        <Button type="button" variant="secondary" onClick={onBack}>
          ← Volver
        </Button>
        <Button type="submit">Reservar turno</Button>
      </div>
    </form>
  );
}

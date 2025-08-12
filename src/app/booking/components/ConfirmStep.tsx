// Paso 5: Confirmación de turno
import { Button } from "@/components/ui/button";
import React from "react";

type Props = {
  service: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  onNew: () => void;
};

export default function ConfirmStep({ service, date, time, name, email, phone, onNew }: Props) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">¡Turno Confirmado!</h2>
      <div className="mb-2 font-semibold">{service}</div>
      <div className="mb-2">{date.split("-").reverse().join("/")} • {time}</div>
      <div className="mb-4">{name} | {email} | {phone}</div>
      <Button onClick={onNew}>Reservar otro</Button>
    </div>
  );
}

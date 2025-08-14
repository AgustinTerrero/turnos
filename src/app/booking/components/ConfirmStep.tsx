// Paso 5: Confirmación de turno
import { Button } from "@/components/ui/button";
import React from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import AnimatedCheckmark from "./AnimatedCheckmark";

type Props = {
  service: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  wantsWhatsappReminder?: boolean;
  onNew: () => void;
};

export default function ConfirmStep({ service, date, time, name, phone, wantsWhatsappReminder, onNew }: Props) {
  // Google Calendar link
  const startDate = date.replace(/-/g, "") + "T" + time.replace(":", "") + "00";
  // Asume duración 1 hora, puedes ajustar según el servicio
  const endDate = date.replace(/-/g, "") + "T" + (parseInt(time.split(":")[0]) + 1).toString().padStart(2, '0') + time.split(":")[1] + "00";
  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(service)}&dates=${startDate}/${endDate}&details=Turno%20con%20${name}%20(${phone})&location=&sf=true&output=xml`;



  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="bg-white shadow-xl rounded-2xl px-8 py-10 max-w-md w-full text-center border border-gray-100">
        <div className="flex justify-center mb-4">
          <AnimatedCheckmark size={72} color="#4f46e5" />
        </div>
        <h1 className="text-2xl font-extrabold mb-2 tracking-tight text-gray-900">Reservá tu turno</h1>
        <h2 className="text-xl font-bold mb-4 text-primary-700">¡Turno Confirmado!</h2>
        <div className="mb-2 font-semibold text-lg text-primary-800">{service}</div>
        <div className="mb-2 text-gray-700">{date.split("-").reverse().join("/")} • {time}</div>
  <div className="mb-4 text-gray-500 text-sm">{name} | {phone}</div>
        <div className="flex flex-col gap-3 mb-6">
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold shadow text-base"
            style={{ background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)', color: '#fff', border: 'none' }}
          >
            <CalendarDaysIcon className="w-6 h-6" />
            Agregar a Google Calendar
          </a>
        </div>
        <Button
          onClick={onNew}
          className="w-full py-3 rounded-lg text-base font-semibold bg-primary-500 text-white hover:bg-primary-600 transition mt-2"
          style={{ background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)', color: '#fff', border: 'none' }}
        >
          Reservar otro
        </Button>
      </div>
    </div>
  );
}

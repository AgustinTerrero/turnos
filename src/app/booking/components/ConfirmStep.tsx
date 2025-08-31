// Paso 5: Confirmación de turno
import { Button } from "@/components/ui/button";
  // WhatsApp info
  const whatsappNumber = "5491123456789"; // Reemplaza por el número real
  const whatsappMsg = encodeURIComponent("Hola, quiero cambiar mi turno o me equivoqué de día.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

import React from "react";
import { CalendarDaysIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
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
        <div className="flex justify-center mb-4 animate-bounce-in">
          <AnimatedCheckmark size={120} color="#22c55e" />
        </div>
        <h1 className="text-3xl font-extrabold mb-2 tracking-tight text-green-700 flex items-center justify-center gap-2">¡Tu turno está reservado! <span className="text-3xl"></span></h1>
        <div className="mb-4 text-lg text-gray-700 font-semibold">Nos vemos pronto</div>
        <div className="mb-2 font-semibold text-lg text-primary-800">{service}</div>
        <div className="mb-2 text-gray-700">{date.split("-").reverse().join("/")} • {time}</div>
        <div className="mb-4 text-gray-500 text-sm">{name} | {phone}</div>
        <style>{`
          @keyframes bounce-in {
            0% { transform: scale(0.7); opacity: 0; }
            60% { transform: scale(1.15); opacity: 1; }
            80% { transform: scale(0.95); }
            100% { transform: scale(1); }
          }
          .animate-bounce-in {
            animation: bounce-in 0.8s cubic-bezier(0.68,-0.55,0.27,1.55);
          }
        `}</style>
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
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 flex flex-col items-center mt-2">
            <div className="text-primary-800 font-semibold mb-1 text-base">¿Querés cambiar tu turno o te equivocaste de día?</div>
            <div className="text-primary-700 text-sm mb-3 text-center">Hablános por WhatsApp y te ayudamos a modificar tu reserva.</div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow text-base bg-green-500 hover:bg-green-600 text-white transition"
            >
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
              Hablános por WhatsApp
            </a>
          </div>
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

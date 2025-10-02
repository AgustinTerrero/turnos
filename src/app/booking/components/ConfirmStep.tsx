// Paso 5: Confirmación de turno
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
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

  // WhatsApp info
  const whatsappNumber = "5491123456789"; // Reemplaza por el número real
  const whatsappMsg = encodeURIComponent("Hola, quiero cambiar mi turno o me equivoqué de día.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

  return (
    <div className="flex justify-center items-center px-2 sm:px-4">
      <div className="bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-3xl px-4 sm:px-8 md:px-12 py-8 sm:py-12 max-w-2xl w-full text-center border-2 border-gray-100">
        {/* Checkmark animado */}
        <div className="flex justify-center mb-6 animate-bounce-in">
          <AnimatedCheckmark size={120} color="#10b981" />
        </div>

        {/* Título de éxito */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 sm:mb-3 tracking-tight bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            ¡Turno confirmado!
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 font-medium">Nos vemos pronto 👋</p>
        </div>

        {/* Detalles del turno */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-indigo-100">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase">Servicio</div>
                <div className="text-base sm:text-lg md:text-xl font-bold text-gray-900 break-words">{service}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white rounded-xl p-3 sm:p-4 border border-indigo-100 min-w-0">
                <div className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase mb-1.5">Fecha</div>
                <div className="text-sm sm:text-base md:text-lg font-bold text-gray-900 break-words leading-tight">{date.split("-").reverse().join("/")}</div>
              </div>
              <div className="bg-white rounded-xl p-3 sm:p-4 border border-indigo-100 min-w-0">
                <div className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase mb-1.5">Hora</div>
                <div className="text-sm sm:text-base md:text-lg font-bold text-gray-900 break-words leading-tight">{time}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 sm:p-4 border border-indigo-100">
              <div className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase mb-1.5">Contacto</div>
              <div className="text-sm sm:text-base font-semibold text-gray-900 break-words">{name}</div>
              <div className="text-xs sm:text-sm text-gray-600 break-all">{phone}</div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-blue-600 text-white transition-all hover:scale-105"
          >
            <CalendarDaysIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            Agregar a Google Calendar
          </a>

          {/* WhatsApp Card */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-3.5 sm:p-5">
            <div className="flex items-start gap-2.5 sm:gap-3 mb-3 sm:mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5 sm:mt-1">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
              </svg>
              <div className="flex-1 text-left min-w-0">
                <div className="text-green-900 font-bold mb-1 text-sm sm:text-base break-words">¿Necesitás cambiar tu turno?</div>
                <p className="text-green-700 text-xs sm:text-sm mb-2.5 sm:mb-3 break-words">Contactanos por WhatsApp y te ayudamos</p>
              </div>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-md hover:shadow-lg text-sm sm:text-base bg-green-600 hover:bg-green-700 text-white transition-all hover:scale-105"
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              Abrir WhatsApp
            </a>
          </div>
        </div>

        {/* Botón nuevo turno */}
        <Button
          onClick={onNew}
          className="w-full py-3 sm:py-4 rounded-xl text-sm sm:text-base font-semibold bg-gray-100 hover:bg-gray-200 border-2 border-gray-200 text-gray-700 transition-all hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Reservar otro turno
        </Button>

        <style>{`
          @keyframes bounce-in {
            0% { transform: scale(0.5); opacity: 0; }
            50% { transform: scale(1.1); opacity: 1; }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); }
          }
          .animate-bounce-in {
            animation: bounce-in 0.8s cubic-bezier(0.68,-0.55,0.27,1.55);
          }
        `}</style>
      </div>
    </div>
  );
}

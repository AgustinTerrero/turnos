import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export function WhatsappReminderButton({ phone, service, date, time }: { phone: string; service: string; date: string; time: string }) {
  if (!phone) return null;
  const whatsappMsg = `¡Hola! Te recordamos tu turno para ${service} el ${date.split("-").reverse().join("/")} a las ${time}.`;
  const whatsappUrl = `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(whatsappMsg)}`;
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-2 py-1 rounded bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition text-xs"
      title="Enviar recordatorio por WhatsApp"
    >
      <ChatBubbleLeftRightIcon className="w-4 h-4" />
      WhatsApp
    </a>
  );
}

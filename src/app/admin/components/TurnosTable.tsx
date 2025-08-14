"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { WhatsappReminderButton } from "./WhatsappReminderButton";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
interface Turno {
  id: string;
  service: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  wantsWhatsappReminder?: boolean;
}

export default function TurnosTable() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroServicio, setFiltroServicio] = useState('all');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroHora, setFiltroHora] = useState('all');

  useEffect(() => {
    const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setTurnos(
        snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Turno))
      );
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDelete = (id: string) => {
    toast(
      "¿Eliminar este turno?",
      {
        action: {
          label: "Eliminar",
          onClick: async () => {
            await deleteDoc(doc(db, "appointments", id));
            toast.success("Turno eliminado");
          },
        },
        duration: 6000,
      }
    );
  };

  const servicios = Array.from(new Set(turnos.map(t => t.service))).filter(Boolean);
  const horas = Array.from(new Set(turnos.map(t => t.time))).filter(Boolean);

  const turnosFiltrados = turnos.filter(t =>
    (filtroServicio === 'all' || t.service === filtroServicio) &&
    (!filtroFecha || t.date === filtroFecha) &&
    (filtroHora === 'all' || t.time === filtroHora)
  );

  if (loading) return <div className="text-lg font-medium text-gray-600 py-10 text-center">Cargando turnos...</div>;
  if (!turnos.length) return <div className="text-lg font-medium text-gray-600 py-10 text-center">No hay turnos registrados.</div>;

  return (
  <div className="overflow-x-auto mt-6 font-[Inter,sans-serif] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent" style={{ WebkitOverflowScrolling: 'touch' }}>
      <div className="flex flex-wrap gap-4 mb-6">
        <Select value={filtroServicio} onValueChange={setFiltroServicio}>
          <SelectTrigger className="min-w-[180px] px-4 py-2 rounded-full border border-gray-200 bg-white shadow focus:shadow-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all text-base font-medium">
            <SelectValue placeholder="Todos los servicios" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los servicios</SelectItem>
            {servicios.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DatePicker
          value={filtroFecha}
          onChange={setFiltroFecha}
          className="min-w-[160px]"
        />
        <Select value={filtroHora} onValueChange={setFiltroHora}>
          <SelectTrigger className="min-w-[150px] px-4 py-2 rounded-full border border-gray-200 bg-white shadow focus:shadow-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all text-base font-medium">
            <SelectValue placeholder="Todas las horas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las horas</SelectItem>
            {horas.map(h => (
              <SelectItem key={h} value={h}>{h}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          className="px-4 py-2 rounded-xl border-0 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold shadow-sm hover:from-indigo-600 hover:to-violet-600 transition text-base outline-none"
          style={{ minWidth: 140 }}
          onClick={() => { setFiltroServicio('all'); setFiltroFecha(''); setFiltroHora('all'); }}
        >Limpiar filtros</button>
      </div>
      <div className="rounded-2xl min-w-[700px] sm:min-w-0 overflow-x-auto border border-gray-200 shadow-xl bg-white/90">
        <table className="min-w-full text-sm sm:text-base">
          <thead>
            <tr className="bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700">
              <th className="p-2 sm:p-3 font-bold text-left whitespace-nowrap">Servicio</th>
              <th className="p-2 sm:p-3 font-bold text-left whitespace-nowrap">Fecha</th>
              <th className="p-2 sm:p-3 font-bold text-left whitespace-nowrap">Hora</th>
              <th className="p-2 sm:p-3 font-bold text-left whitespace-nowrap">Cliente</th>
              <th className="p-2 sm:p-3 font-bold text-left whitespace-nowrap hidden md:table-cell">Teléfono</th>
              <th className="p-2 sm:p-3 font-bold text-center whitespace-nowrap">WhatsApp</th>
              <th className="p-2 sm:p-3 font-bold text-center whitespace-nowrap">Acción</th>
            </tr>
          </thead>
          <tbody>
            {turnosFiltrados.map((t, idx) => (
              <tr key={t.id} className={
                `border-t ${idx % 2 === 0 ? 'bg-white/80' : 'bg-gray-50/80'} hover:bg-primary-50/60 transition`}
              >
                <td className="p-2 sm:p-3 whitespace-nowrap">{t.service}</td>
                <td className="p-2 sm:p-3 whitespace-nowrap">{t.date}</td>
                <td className="p-2 sm:p-3 whitespace-nowrap">{t.time}</td>
                <td className="p-2 sm:p-3 whitespace-nowrap">{t.name}</td>
                <td className="p-2 sm:p-3 whitespace-nowrap hidden md:table-cell">{t.phone}</td>
                <td className="p-2 sm:p-3 text-center whitespace-nowrap">
                  {t.wantsWhatsappReminder ? (
                    <WhatsappReminderButton phone={t.phone} service={t.service} date={t.date} time={t.time} />
                  ) : (
                    <span className="text-xs text-gray-400">No</span>
                  )}
                </td>
                <td className="p-2 sm:p-3 text-center whitespace-nowrap">
                  <button
                    className="px-2 py-1 sm:px-3 sm:py-1 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 hover:text-red-700 transition text-xs sm:text-sm shadow-sm outline-none border border-red-100"
                    onClick={() => handleDelete(t.id)}
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {turnosFiltrados.length === 0 && <div className="mt-4 text-gray-400 text-center">No hay turnos que coincidan con el filtro.</div>}
      </div>
    </div>
  );
}

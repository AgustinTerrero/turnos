
"use client";
import { useState } from "react";
import dayjs from "dayjs";
import { toast } from "sonner";
import { WhatsappReminderButton } from "./WhatsappReminderButton";
import { PencilIcon, CheckCircleIcon, XCircleIcon } from "./Icons";
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
  status?: 'pendiente' | 'confirmado' | 'cancelado';
}

type Props = {
  turnos: Turno[];
  loading: boolean;
};

export default function TurnosTable({ turnos, loading }: Props) {
  const [filtroServicio, setFiltroServicio] = useState('all');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroHora, setFiltroHora] = useState('all');
  const [filtroRango, setFiltroRango] = useState<'hoy' | 'semana' | 'mes' | null>(null);
  const [busqueda, setBusqueda] = useState('');

  const handleDelete = (id: string) => {
    toast(
      "¿Eliminar este turno?",
      {
        action: {
          label: "Eliminar",
          onClick: async () => {
            toast.success("Turno eliminado (simulado)");
          },
        },
        duration: 6000,
      }
    );
  };

  const servicios = Array.from(new Set(turnos.map(t => t.service))).filter(Boolean);
  const horas = Array.from(new Set(turnos.map(t => t.time))).filter(Boolean);

  const hoy = dayjs().format('YYYY-MM-DD');
  const inicioSemana = dayjs().startOf('week').format('YYYY-MM-DD');
  const finSemana = dayjs().endOf('week').format('YYYY-MM-DD');
  const inicioMes = dayjs().startOf('month').format('YYYY-MM-DD');
  const finMes = dayjs().endOf('month').format('YYYY-MM-DD');

  const turnosFiltrados = turnos.filter(t => {
    const coincideServicio = filtroServicio === 'all' || t.service === filtroServicio;
    const coincideFecha = !filtroFecha || t.date === filtroFecha;
    const coincideHora = filtroHora === 'all' || t.time === filtroHora;
    let coincideRango = true;
    if (filtroRango === 'hoy') coincideRango = t.date === hoy;
    if (filtroRango === 'semana') coincideRango = t.date >= inicioSemana && t.date <= finSemana;
    if (filtroRango === 'mes') coincideRango = t.date >= inicioMes && t.date <= finMes;
    const coincideBusqueda = !busqueda || t.name.toLowerCase().includes(busqueda.toLowerCase()) || t.phone.includes(busqueda);
    return coincideServicio && coincideFecha && coincideHora && coincideRango && coincideBusqueda;
  });

  if (loading) return <div className="text-lg font-medium text-gray-600 py-10 text-center">Cargando turnos...</div>;
  if (!turnos.length) return <div className="text-lg font-medium text-gray-600 py-10 text-center">No hay turnos registrados.</div>;

  // Acciones rápidas
  const handleConfirmar = (id: string) => {
    // Aquí deberías actualizar el estado en la base de datos
    toast.success('Turno confirmado');
  };
  const handleCancelar = (id: string) => {
    // Aquí deberías actualizar el estado en la base de datos
    toast.error('Turno cancelado');
  };
  const handleEditar = (id: string) => {
    toast('Función de edición no implementada');
  };

  return (
    <div className="overflow-x-auto mt-6 font-[Inter,sans-serif] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent" style={{ WebkitOverflowScrolling: 'touch' }}>
      {/* Chips de filtro y búsqueda */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="flex gap-2">
          {['hoy', 'semana', 'mes'].map(rango => (
            <button
              key={rango}
              className={`px-4 py-1 rounded-full border text-sm font-semibold transition-all shadow-sm ${filtroRango === rango ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
              onClick={() => setFiltroRango(filtroRango === rango ? null : rango as any)}
            >
              {rango === 'hoy' ? 'Hoy' : rango === 'semana' ? 'Semana' : 'Mes'}
            </button>
          ))}
        </div>
        <input
          type="text"
          className="ml-4 px-3 py-2 rounded-lg border border-gray-200 bg-white shadow text-base focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 outline-none min-w-[180px]"
          placeholder="Buscar cliente o teléfono..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>
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
            {turnosFiltrados.map((t, idx) => {
              // Estado visual
              const esPasado = dayjs(t.date).isBefore(dayjs(), 'day');
              const esHoy = t.date === hoy;
              const esCancelado = t.status === 'cancelado';
              return (
                <tr key={t.id} className={`border-t transition
                  ${esCancelado ? 'bg-red-50/60' : esHoy ? 'bg-blue-50/60' : idx % 2 === 0 ? 'bg-white/80' : 'bg-gray-50/80'}
                  ${esHoy ? 'ring-2 ring-blue-300' : ''}
                `}>
                  <td className={`p-2 sm:p-3 whitespace-nowrap ${esCancelado ? 'text-red-500 line-through' : esPasado ? 'text-gray-400' : ''}`}>{t.service}</td>
                  <td className={`p-2 sm:p-3 whitespace-nowrap ${esCancelado ? 'text-red-500 line-through' : esPasado ? 'text-gray-400' : ''}`}>{t.date}</td>
                  <td className={`p-2 sm:p-3 whitespace-nowrap ${esCancelado ? 'text-red-500 line-through' : esPasado ? 'text-gray-400' : ''}`}>{t.time}</td>
                  <td className={`p-2 sm:p-3 whitespace-nowrap ${esCancelado ? 'text-red-500 line-through' : esPasado ? 'text-gray-400' : ''}`}>{t.name}</td>
                  <td className={`p-2 sm:p-3 whitespace-nowrap hidden md:table-cell ${esCancelado ? 'text-red-500 line-through' : esPasado ? 'text-gray-400' : ''}`}>{t.phone}</td>
                  <td className="p-2 sm:p-3 text-center whitespace-nowrap">
                    {t.wantsWhatsappReminder ? (
                      <WhatsappReminderButton phone={t.phone} service={t.service} date={t.date} time={t.time} />
                    ) : (
                      <span className="text-xs text-gray-400">No</span>
                    )}
                  </td>
                  <td className="p-2 sm:p-3 text-center whitespace-nowrap flex gap-1 items-center justify-center">
                    {/* Editar */}
                    <button title="Editar" className="p-1 rounded hover:bg-gray-100" onClick={() => handleEditar(t.id)}>
                      <PencilIcon className="w-5 h-5 text-gray-500" />
                    </button>
                    {/* Confirmar asistencia */}
                    <button title="Confirmar asistencia" className="p-1 rounded hover:bg-green-100" onClick={() => handleConfirmar(t.id)}>
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    </button>
                    {/* Cancelar */}
                    <button title="Cancelar" className="p-1 rounded hover:bg-red-100" onClick={() => handleCancelar(t.id)}>
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                    </button>
                    {/* Borrar */}
                    <button
                      className="p-1 rounded hover:bg-red-100"
                      onClick={() => handleDelete(t.id)}
                      title="Borrar"
                    >
                      <span className="text-xs text-red-600 font-bold">🗑</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {turnosFiltrados.length === 0 && <div className="mt-4 text-gray-400 text-center">No hay turnos que coincidan con el filtro.</div>}
      </div>
    </div>
  );
}

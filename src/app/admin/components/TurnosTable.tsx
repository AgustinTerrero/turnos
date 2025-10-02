
"use client";
import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";


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

interface Servicio {
  id: string;
  nombre: string;
  duracion: number;
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
  
  // Estado del modal de edición
  const [modalAbierto, setModalAbierto] = useState(false);
  const [turnoEditando, setTurnoEditando] = useState<Turno | null>(null);
  const [serviciosDisponibles, setServiciosDisponibles] = useState<Servicio[]>([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  
  // Form state
  const [editService, setEditService] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');

  // Cargar servicios disponibles
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "servicios"), (snap) => {
      setServiciosDisponibles(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as Servicio))
      );
    });
    return () => unsub();
  }, []);

  // Generar horarios disponibles (ejemplo: de 9:00 a 18:00 cada 30 min)
  useEffect(() => {
    const horarios: string[] = [];
    for (let h = 9; h <= 18; h++) {
      horarios.push(`${h.toString().padStart(2, '0')}:00`);
      if (h < 18) horarios.push(`${h.toString().padStart(2, '0')}:30`);
    }
    setHorariosDisponibles(horarios);
  }, []);

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
  
  const handleEditar = (turno: Turno) => {
    setTurnoEditando(turno);
    setEditService(turno.service);
    setEditDate(turno.date);
    setEditTime(turno.time);
    setEditName(turno.name);
    setEditPhone(turno.phone);
    setEditEmail(turno.email);
    setModalAbierto(true);
  };

  const handleGuardarEdicion = async () => {
    if (!turnoEditando) return;
    
    // Aquí deberías actualizar en Firebase
    // Por ahora solo mostramos un toast
    toast.success('Turno actualizado correctamente');
    setModalAbierto(false);
    setTurnoEditando(null);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setTurnoEditando(null);
  };

  return (
    <div className="mt-6">
      {/* Header con título y búsqueda */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Turnos Programados
          <span className="ml-3 text-lg font-medium text-gray-500">({turnosFiltrados.length})</span>
        </h2>
        <input
          type="text"
          className="w-full sm:w-64 px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white shadow-sm text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all"
          placeholder="🔍 Buscar cliente o teléfono..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      {/* Filtros rápidos */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['hoy', 'semana', 'mes'].map(rango => (
          <button
            key={rango}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
              filtroRango === rango 
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 hover:border-indigo-200'
            }`}
            onClick={() => setFiltroRango(filtroRango === rango ? null : rango as 'hoy' | 'semana' | 'mes')}
          >
            {rango === 'hoy' ? '📅 Hoy' : rango === 'semana' ? '📆 Esta Semana' : '🗓️ Este Mes'}
          </button>
        ))}
      </div>
      {/* Filtros avanzados */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Select value={filtroServicio} onValueChange={setFiltroServicio}>
          <SelectTrigger className="min-w-[180px] px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all text-sm font-medium">
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
          <SelectTrigger className="min-w-[150px] px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all text-sm font-medium">
            <SelectValue placeholder="Todas las horas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las horas</SelectItem>
            {horas.map(h => (
              <SelectItem key={h} value={h}>{h}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(filtroServicio !== 'all' || filtroFecha || filtroHora !== 'all' || filtroRango) && (
          <button
            className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 border-2 border-gray-200 text-gray-700 font-semibold shadow-sm transition-all text-sm"
            onClick={() => { setFiltroServicio('all'); setFiltroFecha(''); setFiltroHora('all'); setFiltroRango(null); setBusqueda(''); }}
          >
            ✕ Limpiar
          </button>
        )}
      </div>
      {/* Vista de cards en móvil, tabla en desktop */}
      {turnosFiltrados.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-600">No hay turnos que coincidan</p>
          <p className="text-sm text-gray-400 mt-2">Intenta ajustar los filtros</p>
        </div>
      ) : (
        <>
          {/* Vista móvil: Cards */}
          <div className="block lg:hidden space-y-3">
            {turnosFiltrados.map((t) => {
              const esPasado = dayjs(t.date).isBefore(dayjs(), 'day');
              const esHoy = t.date === hoy;
              const esCancelado = t.status === 'cancelado';
              
              return (
                <div
                  key={t.id}
                  className={`bg-white rounded-2xl border-2 p-4 shadow-sm transition-all hover:shadow-md ${
                    esCancelado ? 'border-red-200 bg-red-50/30' : 
                    esHoy ? 'border-indigo-300 bg-indigo-50/30' : 
                    'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className={`font-bold text-base mb-1 ${esCancelado ? 'text-red-500 line-through' : 'text-gray-900'}`}>
                        {t.service}
                      </h3>
                      <p className={`text-sm ${esCancelado ? 'text-red-400' : 'text-gray-600'}`}>
                        {t.name}
                      </p>
                    </div>
                    {esHoy && <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">HOY</span>}
                    {esCancelado && <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">CANCELADO</span>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      <span className="text-gray-600">{t.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-600">{t.time}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                      <span className="text-gray-600">{t.phone}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                    {t.wantsWhatsappReminder && (
                      <WhatsappReminderButton phone={t.phone} service={t.service} date={t.date} time={t.time} />
                    )}
                    <div className="flex-1"></div>
                    <button title="Editar" className="p-2 rounded-lg hover:bg-blue-100 transition-colors" onClick={() => handleEditar(t)}>
                      <PencilIcon className="w-5 h-5 text-blue-600" />
                    </button>
                    <button title="Confirmar" className="p-2 rounded-lg hover:bg-green-100 transition-colors" onClick={() => handleConfirmar(t.id)}>
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    </button>
                    <button title="Cancelar" className="p-2 rounded-lg hover:bg-red-100 transition-colors" onClick={() => handleCancelar(t.id)}>
                      <XCircleIcon className="w-5 h-5 text-red-600" />
                    </button>
                    <button title="Eliminar" className="p-2 rounded-lg hover:bg-red-100 transition-colors" onClick={() => handleDelete(t.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vista desktop: Tabla */}
          <div className="hidden lg:block rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-blue-50">
                    <th className="px-4 py-3 font-bold text-left text-indigo-900">Servicio</th>
                    <th className="px-4 py-3 font-bold text-left text-indigo-900">Fecha</th>
                    <th className="px-4 py-3 font-bold text-left text-indigo-900">Hora</th>
                    <th className="px-4 py-3 font-bold text-left text-indigo-900">Cliente</th>
                    <th className="px-4 py-3 font-bold text-left text-indigo-900">Teléfono</th>
                    <th className="px-4 py-3 font-bold text-center text-indigo-900">WhatsApp</th>
                    <th className="px-4 py-3 font-bold text-center text-indigo-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {turnosFiltrados.map((t, idx) => {
                    const esPasado = dayjs(t.date).isBefore(dayjs(), 'day');
                    const esHoy = t.date === hoy;
                    const esCancelado = t.status === 'cancelado';
                    
                    return (
                      <tr
                        key={t.id}
                        className={`border-t border-gray-200 transition-colors hover:bg-gray-50 ${
                          esCancelado ? 'bg-red-50/40' : 
                          esHoy ? 'bg-indigo-50/40' : 
                          idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                        }`}
                      >
                        <td className={`px-4 py-3 font-medium ${esCancelado ? 'text-red-500 line-through' : 'text-gray-900'}`}>
                          {t.service}
                        </td>
                        <td className={`px-4 py-3 ${esCancelado ? 'text-red-400' : 'text-gray-600'}`}>
                          {t.date}
                          {esHoy && <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">HOY</span>}
                        </td>
                        <td className={`px-4 py-3 ${esCancelado ? 'text-red-400' : 'text-gray-600'}`}>{t.time}</td>
                        <td className={`px-4 py-3 font-medium ${esCancelado ? 'text-red-500 line-through' : 'text-gray-900'}`}>{t.name}</td>
                        <td className={`px-4 py-3 ${esCancelado ? 'text-red-400' : 'text-gray-600'}`}>{t.phone}</td>
                        <td className="px-4 py-3 text-center">
                          {t.wantsWhatsappReminder ? (
                            <WhatsappReminderButton phone={t.phone} service={t.service} date={t.date} time={t.time} />
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button title="Editar" className="p-1.5 rounded-lg hover:bg-blue-100 transition-colors" onClick={() => handleEditar(t)}>
                              <PencilIcon className="w-5 h-5 text-blue-600" />
                            </button>
                            <button title="Confirmar" className="p-1.5 rounded-lg hover:bg-green-100 transition-colors" onClick={() => handleConfirmar(t.id)}>
                              <CheckCircleIcon className="w-5 h-5 text-green-600" />
                            </button>
                            <button title="Cancelar" className="p-1.5 rounded-lg hover:bg-red-100 transition-colors" onClick={() => handleCancelar(t.id)}>
                              <XCircleIcon className="w-5 h-5 text-red-600" />
                            </button>
                            <button title="Eliminar" className="p-1.5 rounded-lg hover:bg-red-100 transition-colors" onClick={() => handleDelete(t.id)}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal de edición */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-2xl border-2 border-gray-200">
          {/* Header del modal */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b-2 border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                Editar Turno
              </DialogTitle>
              <p className="text-sm text-blue-700 mt-1">Modifica los detalles de la reserva del cliente</p>
            </DialogHeader>
          </div>

          {/* Body del modal */}
          <div className="px-6 py-6 space-y-5 max-h-[60vh] overflow-y-auto">
            {/* Servicio */}
            <div className="space-y-2">
              <Label htmlFor="edit-service" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
                Servicio
              </Label>
              <Select value={editService} onValueChange={setEditService}>
                <SelectTrigger id="edit-service" className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all font-medium">
                  <SelectValue placeholder="Selecciona un servicio" />
                </SelectTrigger>
                <SelectContent>
                  {serviciosDisponibles.map((s) => (
                    <SelectItem key={s.id} value={s.nombre}>
                      {s.nombre} ({s.duracion} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  Fecha
                </Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all font-medium"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-time" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Hora
                </Label>
                <Select value={editTime} onValueChange={setEditTime}>
                  <SelectTrigger id="edit-time" className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all font-medium">
                    <SelectValue placeholder="Hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {horariosDisponibles.map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Nombre del cliente */}
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Nombre del cliente
              </Label>
              <Input
                id="edit-name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all font-medium"
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="edit-phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                Teléfono
              </Label>
              <Input
                id="edit-phone"
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="1234567890"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all font-medium"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="cliente@ejemplo.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all font-medium"
              />
            </div>
          </div>

          {/* Footer del modal */}
          <div className="bg-gray-50 px-6 py-4 border-t-2 border-gray-200">
            <DialogFooter className="gap-3 sm:gap-3">
              <button
                type="button"
                onClick={handleCerrarModal}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-semibold shadow-sm hover:bg-gray-50 hover:shadow-md transition-all"
              >
                ✕ Cancelar
              </button>
              <button
                type="button"
                onClick={handleGuardarEdicion}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transition-all"
              >
                💾 Guardar Cambios
              </button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

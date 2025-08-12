"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";

interface Turno {
  id: string;
  service: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
}

export default function TurnosTable() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroServicio, setFiltroServicio] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroHora, setFiltroHora] = useState('');

  useEffect(() => {
    const q = query(collection(db, "appointments"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setTurnos(
        snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Turno))
      );
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar este turno?")) {
      await deleteDoc(doc(db, "appointments", id));
    }
  };

  const servicios = Array.from(new Set(turnos.map(t => t.service))).filter(Boolean);
  const horas = Array.from(new Set(turnos.map(t => t.time))).filter(Boolean);

  const turnosFiltrados = turnos.filter(t =>
    (!filtroServicio || t.service === filtroServicio) &&
    (!filtroFecha || t.date === filtroFecha) &&
    (!filtroHora || t.time === filtroHora)
  );

  if (loading) return <div>Cargando turnos...</div>;
  if (!turnos.length) return <div>No hay turnos registrados.</div>;

  return (
    <div className="overflow-x-auto mt-6">
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          className="border rounded px-2 py-1"
          value={filtroServicio}
          onChange={e => setFiltroServicio(e.target.value)}
        >
          <option value="">Todos los servicios</option>
          {servicios.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={filtroFecha}
          onChange={e => setFiltroFecha(e.target.value)}
        />
        <select
          className="border rounded px-2 py-1"
          value={filtroHora}
          onChange={e => setFiltroHora(e.target.value)}
        >
          <option value="">Todas las horas</option>
          {horas.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
        <button
          className="border rounded px-2 py-1 text-xs"
          onClick={() => { setFiltroServicio(''); setFiltroFecha(''); setFiltroHora(''); }}
        >Limpiar filtros</button>
      </div>
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Servicio</th>
            <th className="p-2">Fecha</th>
            <th className="p-2">Hora</th>
            <th className="p-2">Cliente</th>
            <th className="p-2">Email</th>
            <th className="p-2">Teléfono</th>
            <th className="p-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {turnosFiltrados.map((t) => (
            <tr key={t.id} className="border-t">
              <td className="p-2">{t.service}</td>
              <td className="p-2">{t.date}</td>
              <td className="p-2">{t.time}</td>
              <td className="p-2">{t.name}</td>
              <td className="p-2">{t.email}</td>
              <td className="p-2">{t.phone}</td>
              <td className="p-2">
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(t.id)}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {turnosFiltrados.length === 0 && <div className="mt-4 text-muted-foreground">No hay turnos que coincidan con el filtro.</div>}
    </div>
  );
}

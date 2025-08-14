"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

interface Servicio {
  id: string;
  nombre: string;
  duracion: number; // minutos
}

export default function ServiciosManager() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [nombre, setNombre] = useState("");
  const [duracion, setDuracion] = useState(30);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "servicios"), (snap) => {
      setServicios(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as Servicio))
      );
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleAddOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    if (editId) {
      await updateDoc(doc(db, "servicios", editId), {
        nombre,
        duracion,
      });
    } else {
      await addDoc(collection(db, "servicios"), {
        nombre,
        duracion,
      });
    }
    setNombre("");
    setDuracion(30);
    setEditId(null);
  };

  const handleEdit = (servicio: Servicio) => {
    setEditId(servicio.id);
    setNombre(servicio.nombre);
    setDuracion(servicio.duracion);
  };

  const handleDelete = (id: string) => {
    toast(
      "¿Eliminar este servicio?",
      {
        action: {
          label: "Eliminar",
          onClick: async () => {
            await deleteDoc(doc(db, "servicios", id));
            toast.success("Servicio eliminado");
          },
        },
        duration: 6000,
      }
    );
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4 text-primary-700">Servicios</h3>
      <form onSubmit={handleAddOrEdit} className="flex flex-wrap gap-3 mb-6">
        <input
          className="border border-gray-200 rounded-full px-4 py-2 text-base shadow focus:shadow-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all outline-none min-w-[180px]"
          placeholder="Nombre del servicio"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          className="border border-gray-200 rounded-full px-4 py-2 text-base shadow focus:shadow-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all outline-none w-28"
          type="number"
          min={5}
          step={5}
          value={duracion}
          onChange={(e) => setDuracion(Number(e.target.value))}
          required
          placeholder="Duración (min)"
        />
        <button
          className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-violet-600 transition text-base outline-none"
          type="submit"
        >
          {editId ? "Guardar" : "Agregar"}
        </button>
        {editId && (
          <button
            type="button"
            className="px-6 py-2 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold shadow hover:bg-gray-50 transition text-base outline-none"
            onClick={() => {
              setEditId(null);
              setNombre("");
              setDuracion(30);
            }}
          >
            Cancelar
          </button>
        )}
      </form>
      {loading ? (
        <div className="text-lg font-medium text-gray-600 py-10 text-center">Cargando servicios...</div>
      ) : (
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-white/90">
          <table className="min-w-full text-base">
            <thead>
              <tr className="bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700">
                <th className="p-3 font-bold text-left">Nombre</th>
                <th className="p-3 font-bold text-left">Duración (min)</th>
                <th className="p-3 font-bold text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map((s, idx) => (
                <tr key={s.id} className={
                  `border-t ${idx % 2 === 0 ? 'bg-white/80' : 'bg-gray-50/80'} hover:bg-primary-50/60 transition`}
                >
                  <td className="p-3">{s.nombre}</td>
                  <td className="p-3">{s.duracion}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      className="text-blue-600 font-semibold hover:underline"
                      type="button"
                      onClick={() => handleEdit(s)}
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-600 font-semibold hover:underline"
                      type="button"
                      onClick={() => handleDelete(s.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

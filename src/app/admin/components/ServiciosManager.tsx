"use client";
import React, { useEffect, useState } from "react";
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

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar este servicio?")) {
      await deleteDoc(doc(db, "servicios", id));
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Servicios</h3>
      <form onSubmit={handleAddOrEdit} className="flex flex-wrap gap-2 mb-4">
        <input
          className="border rounded px-2 py-1"
          placeholder="Nombre del servicio"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          className="border rounded px-2 py-1 w-24"
          type="number"
          min={5}
          step={5}
          value={duracion}
          onChange={(e) => setDuracion(Number(e.target.value))}
          required
          placeholder="Duración (min)"
        />
        <button
          className="bg-primary text-white px-3 py-1 rounded"
          type="submit"
        >
          {editId ? "Guardar" : "Agregar"}
        </button>
        {editId && (
          <button
            type="button"
            className="px-3 py-1 rounded border"
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
        <div>Cargando servicios...</div>
      ) : (
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Nombre</th>
              <th className="p-2">Duración (min)</th>
              <th className="p-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{s.nombre}</td>
                <td className="p-2">{s.duracion}</td>
                <td className="p-2 flex gap-2">
                  <button
                    className="text-blue-600 hover:underline"
                    type="button"
                    onClick={() => handleEdit(s)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-600 hover:underline"
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
      )}
    </div>
  );
}

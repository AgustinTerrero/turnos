"use client";
import React, { useEffect, useState, useRef } from "react";
// API key de imgbb proporcionada por el usuario
const IMGBB_API_KEY = "5140e73526fd6bc076485326ba259cce";
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
  imagen?: string; // url de imagen descriptiva
}

export default function ServiciosManager() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [nombre, setNombre] = useState("");
  const [duracion, setDuracion] = useState(30);
  const [editId, setEditId] = useState<string | null>(null);
  const [imagen, setImagen] = useState("");
  const [uploading, setUploading] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Drag & drop handlers
  useEffect(() => {
    const drop = dropRef.current;
    if (!drop) return;
  const prevent = (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); };
    drop.addEventListener('dragover', prevent);
    drop.addEventListener('dragenter', prevent);
    drop.addEventListener('drop', prevent);
    return () => {
      drop.removeEventListener('dragover', prevent);
      drop.removeEventListener('dragenter', prevent);
      drop.removeEventListener('drop', prevent);
    };
  }, []);

  const handleFile = async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: form,
    });
    const data = await res.json();
    if (data.success) {
      setImagen(data.data.url);
    } else {
      alert('Error al subir imagen');
    }
    setUploading(false);
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const unsub = onSnapshot(
        collection(db, "servicios"),
        (snap) => {
          setServicios(
            snap.docs.map((d) => ({ id: d.id, ...d.data() } as Servicio))
          );
          setLoading(false);
        },
        (error) => {
          console.error("Error loading servicios:", error);
          setLoading(false);
        }
      );
      return () => unsub();
    } catch (error) {
      console.error("Error setting up servicios listener:", error);
      setLoading(false);
    }
  }, []);

  const handleAddOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    if (editId) {
    await updateDoc(doc(db, "servicios", editId), {
      nombre,
      duracion,
      imagen,
    });
  } else {
    await addDoc(collection(db, "servicios"), {
      nombre,
      duracion,
      imagen,
    });
  }
    setNombre("");
    setDuracion(30);
    setEditId(null);
  setImagen("");
  };

  const handleEdit = (servicio: Servicio) => {
    setEditId(servicio.id);
    setNombre(servicio.nombre);
    setDuracion(servicio.duracion);
  setImagen(servicio.imagen || "");
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
        <div
          ref={dropRef}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl px-4 py-4 min-w-[180px] cursor-pointer transition-all ${uploading ? 'opacity-60 pointer-events-none' : 'hover:border-indigo-400'}`}
          onClick={() => !uploading && document.getElementById('file-input-servicio')?.click()}
          onDrop={async (e) => {
            e.preventDefault();
            if (uploading) return;
            const file = e.dataTransfer.files[0];
            if (file) await handleFile(file);
          }}
        >
          {imagen ? (
            <img src={imagen} alt="Imagen servicio" className="w-20 h-20 object-cover rounded-lg mb-2 border shadow" />
          ) : (
            <span className="text-gray-400 text-sm">Arrastra una imagen aquí o haz click</span>
          )}
          <input
            id="file-input-servicio"
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) await handleFile(file);
            }}
          />
          {uploading && <span className="text-xs text-indigo-500 mt-1">Subiendo imagen...</span>}
        </div>
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
              setImagen("");
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
                <th className="p-3 font-bold text-left">Imagen</th>
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
                  <td className="p-3">{s.imagen && <img src={s.imagen} alt={s.nombre} className="w-14 h-14 object-cover rounded-lg border" />}</td>
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

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
    <div className="space-y-6">
      {/* Formulario de servicio */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b-2 border-gray-200">
          <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            {editId ? "Editar Servicio" : "Agregar Nuevo Servicio"}
          </h3>
          <p className="text-sm text-emerald-700 mt-1">Configura los servicios que ofreces a tus clientes</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleAddOrEdit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Nombre del servicio</label>
                <input
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-base shadow-sm focus:shadow-md focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition-all outline-none"
                  placeholder="Ej: Corte de cabello"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Duración (minutos)</label>
                <input
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-base shadow-sm focus:shadow-md focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition-all outline-none"
                  type="number"
                  min={5}
                  step={5}
                  value={duracion}
                  onChange={(e) => setDuracion(Number(e.target.value))}
                  required
                  placeholder="30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Imagen del servicio</label>
              <div
                ref={dropRef}
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${
                  uploading 
                    ? 'opacity-60 pointer-events-none border-gray-300' 
                    : 'hover:border-emerald-400 hover:bg-emerald-50/30 border-gray-300'
                }`}
                onClick={() => !uploading && document.getElementById('file-input-servicio')?.click()}
                onDrop={async (e) => {
                  e.preventDefault();
                  if (uploading) return;
                  const file = e.dataTransfer.files[0];
                  if (file) await handleFile(file);
                }}
              >
                {imagen ? (
                  <div className="text-center">
                    <img src={imagen} alt="Imagen servicio" className="w-32 h-32 object-cover rounded-xl mb-3 border-2 border-emerald-200 shadow-md mx-auto" />
                    <p className="text-sm text-emerald-600 font-medium">✓ Imagen cargada</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400 mx-auto mb-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <p className="text-gray-600 font-medium mb-1">📸 Arrastra una imagen aquí</p>
                    <p className="text-gray-400 text-sm">o haz clic para seleccionar</p>
                  </div>
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
                {uploading && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="animate-spin h-4 w-4 border-2 border-emerald-600 border-t-transparent rounded-full"></div>
                    <span className="text-sm text-emerald-600 font-medium">Subiendo imagen...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold shadow-lg hover:from-emerald-700 hover:to-green-700 hover:shadow-xl transition-all text-base outline-none"
                type="submit"
              >
                {editId ? "💾 Guardar Cambios" : "➕ Agregar Servicio"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-semibold shadow hover:bg-gray-50 hover:shadow-md transition-all text-base outline-none"
                  onClick={() => {
                    setEditId(null);
                    setNombre("");
                    setDuracion(30);
                    setImagen("");
                  }}
                >
                  ✕ Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      {/* Lista de servicios */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b-2 border-gray-200">
          <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            Servicios Disponibles
            <span className="ml-auto text-base font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {servicios.length} {servicios.length === 1 ? 'servicio' : 'servicios'}
            </span>
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="ml-3 text-gray-600 font-medium">Cargando servicios...</span>
          </div>
        ) : servicios.length === 0 ? (
          <div className="p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-300 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <h4 className="text-xl font-bold text-gray-600 mb-2">No hay servicios aún</h4>
            <p className="text-gray-500">Agrega tu primer servicio usando el formulario de arriba</p>
          </div>
        ) : (
          <>
            {/* Vista móvil - Cards */}
            <div className="block md:hidden divide-y-2 divide-gray-100">
              {servicios.map((s) => (
                <div key={s.id} className="p-4 hover:bg-blue-50/50 transition-colors">
                  <div className="flex gap-4">
                    {s.imagen && (
                      <img 
                        src={s.imagen} 
                        alt={s.nombre} 
                        className="w-20 h-20 object-cover rounded-xl border-2 border-blue-200 shadow-sm flex-shrink-0" 
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-lg mb-1 truncate">{s.nombre}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">{s.duracion} min</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm hover:bg-blue-200 transition-colors"
                          type="button"
                          onClick={() => handleEdit(s)}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg font-semibold text-sm hover:bg-red-200 transition-colors"
                          type="button"
                          onClick={() => handleDelete(s.id)}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Vista desktop - Tabla */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-base">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900">
                    <th className="px-6 py-3 font-bold text-left">Imagen</th>
                    <th className="px-6 py-3 font-bold text-left">Nombre</th>
                    <th className="px-6 py-3 font-bold text-left">Duración</th>
                    <th className="px-6 py-3 font-bold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {servicios.map((s, idx) => (
                    <tr 
                      key={s.id} 
                      className={`border-t-2 border-gray-100 ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      } hover:bg-blue-50/50 transition-colors`}
                    >
                      <td className="px-6 py-4">
                        {s.imagen ? (
                          <img 
                            src={s.imagen} 
                            alt={s.nombre} 
                            className="w-16 h-16 object-cover rounded-xl border-2 border-blue-200 shadow-sm" 
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{s.nombre}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-semibold text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {s.duracion} min
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm hover:bg-blue-200 hover:shadow-md transition-all inline-flex items-center gap-1.5"
                            type="button"
                            onClick={() => handleEdit(s)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            Editar
                          </button>
                          <button
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold text-sm hover:bg-red-200 hover:shadow-md transition-all inline-flex items-center gap-1.5"
                            type="button"
                            onClick={() => handleDelete(s.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

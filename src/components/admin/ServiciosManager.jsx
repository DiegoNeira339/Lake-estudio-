"use client";
import { useState, useEffect, useRef } from "react";
import Swal from 'sweetalert2';
import Image from "next/image";

export default function ServiciosManager({ servicios, onRefresh }) {
  const [formServicio, setFormServicio] = useState({ 
    id: null, 
    titulo: '', 
    precio: '', 
    descripcion: '', 
    foto_url: '', 
    fotos_extra: '' 
  });
  const [fotoServicio, setFotoServicio] = useState(null);
  const [fotosExtraServicio, setFotosExtraServicio] = useState([]);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const fileInputRef = useRef(null);
  const fileExtraRef = useRef(null);

  const resetForm = () => {
    setFormServicio({ id: null, titulo: '', precio: '', descripcion: '', foto_url: '', fotos_extra: '' });
    setFotoServicio(null);
    setFotosExtraServicio([]);
    setEditando(false);
  };

  const guardarServicio = async (e) => {
    e.preventDefault();
    setGuardando(true);
    const formData = new FormData();
    if (formServicio.id) formData.append('id', formServicio.id);
    formData.append('titulo', formServicio.titulo);
    formData.append('precio', formServicio.precio);
    formData.append('descripcion', formServicio.descripcion);
    if (formServicio.foto_url) formData.append('foto_url', formServicio.foto_url);
    if (formServicio.fotos_extra) formData.append('fotos_extra_actuales', formServicio.fotos_extra);
    if (fotoServicio) formData.append('foto', fotoServicio);
    
    for (let i = 0; i < fotosExtraServicio.length; i++) {
      formData.append('fotos_extra', fotosExtraServicio[i]);
    }

    const metodo = editando ? 'PUT' : 'POST';
    try {
      const res = await fetch('/api/servicios', { method: metodo, body: formData });
      if (res.ok) {
        Swal.fire('¡Éxito!', `Servicio ${editando ? 'actualizado' : 'creado'}`, 'success');
        onRefresh?.();
        resetForm();
      } else throw new Error();
    } catch (error) { 
      Swal.fire('Error', 'Hubo un problema guardando el servicio', 'error'); 
    } finally { setGuardando(false); }
  };

  const eliminarServicio = async (id) => {
    const { isConfirmed } = await Swal.fire({ 
      title: '¿Borrar servicio?', 
      text: "Desaparecerá de la página", 
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonColor: '#ef4444' 
    });
    if (!isConfirmed) return;
    try {
      const res = await fetch('/api/servicios', { 
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }) 
      });
      if (res.ok) { onRefresh?.(); Swal.fire('Eliminado', 'El servicio se borró', 'success'); }
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al eliminar', 'error');
    }
  };

  const editarServicio = (s) => {
    setFormServicio(s);
    setEditando(true);
    setFotoServicio(null);
    setFotosExtraServicio([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-gray-100">
      <h2 className="text-2xl font-bold text-lake-dark mb-2">Gestión de Servicios ✨</h2>
      <p className="text-gray-500 mb-8">Estos son los servicios que las clientas verán en la página principal.</p>

      <form onSubmit={guardarServicio} className="mb-12 bg-lake-pink/10 p-6 rounded-3xl border-2 border-lake-pink/30">
        <h3 className="font-bold text-xl mb-4 text-lake-dark">
          {editando ? '✏️ Editar Servicio' : '➕ Crear Nuevo Servicio'}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Título (Ej: Limpieza Facial)" 
            value={formServicio.titulo || ""} 
            onChange={e => setFormServicio({...formServicio, titulo: e.target.value})} 
            className="border-2 p-3 rounded-xl w-full outline-none focus:border-lake-pink bg-white shadow-sm" 
            required 
          />
          <input 
            type="text" 
            placeholder="Precio (Ej: 20.000)" 
            value={formServicio.precio || ""} 
            onChange={e => setFormServicio({...formServicio, precio: e.target.value})} 
            className="border-2 p-3 rounded-xl w-full outline-none focus:border-lake-pink bg-white shadow-sm" 
            required 
          />
          
          <div className="relative">
            <label className="text-xs font-bold text-gray-500 mb-1 block">Foto de Portada</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={e => setFotoServicio(e.target.files[0])} 
              className="border-2 p-2 rounded-xl w-full bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-lake-pink file:text-lake-dark hover:file:bg-pink-300 shadow-sm cursor-pointer" 
            />
          </div>

          <div className="relative">
            <label className="text-xs font-bold text-gray-500 mb-1 block">Fotos Adicionales (Opcional - Carrusel)</label>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              ref={fileExtraRef}
              onChange={e => setFotosExtraServicio(e.target.files)} 
              className="border-2 p-2 rounded-xl w-full bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-lake-dark hover:file:bg-gray-300 shadow-sm cursor-pointer" 
            />
            
            {editando && formServicio.fotos_extra && formServicio.fotos_extra.length > 0 && (
              <div className="mt-3 p-3 bg-white rounded-xl border-2 border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-500 mb-2">Fotos actuales en el carrusel (Clic para borrar):</p>
                <div className="flex gap-2 flex-wrap">
                  {formServicio.fotos_extra.split(',').filter(Boolean).map((url, idx) => (
                    <div 
                      key={idx} 
                      className="relative w-16 h-16 rounded-lg overflow-hidden shadow-sm group border border-gray-200 cursor-pointer"
                      onClick={() => {
                        const nuevas = formServicio.fotos_extra.split(',').filter(u => u !== url).join(',');
                        setFormServicio({...formServicio, fotos_extra: nuevas});
                      }}
                    >
                      <Image src={url} alt="Extra" fill className="object-cover group-hover:opacity-40 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-red-600 font-extrabold text-2xl">✕</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <textarea 
            placeholder="Descripción del servicio" 
            value={formServicio.descripcion || ""} 
            onChange={e => setFormServicio({...formServicio, descripcion: e.target.value})} 
            className="border-2 p-3 rounded-xl w-full md:col-span-2 outline-none focus:border-lake-pink bg-white resize-none shadow-sm" 
            required 
            rows="3"
          ></textarea>
        </div>

        <div className="mt-6 flex gap-3">
          {editando && (
            <button 
              type="button" 
              onClick={resetForm} 
              className="w-1/3 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors shadow-sm"
            >
              Cancelar
            </button>
          )}
          <button 
            type="submit" 
            disabled={guardando} 
            className={`${editando ? 'w-2/3' : 'w-full'} bg-lake-dark text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-400 shadow-sm`}
          >
            {guardando ? '⏳ Guardando...' : (editando ? 'Guardar Cambios' : 'Crear Servicio')}
          </button>
        </div>
      </form>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicios.map(s => (
          <div key={s.id} className="border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:border-lake-matcha transition-colors flex flex-col h-full bg-white group">
            <div className="h-48 relative bg-gray-100 overflow-hidden">
              {s.foto_url ? (
                <Image src={s.foto_url} alt={s.titulo} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 font-medium">Sin foto 📷</div>
              )}
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h4 className="font-bold text-xl mb-1 capitalize text-lake-dark">{s.titulo}</h4>
              <p className="text-pink-500 font-bold mb-4">${s.precio}</p>
              <p className="text-sm text-gray-600 mb-6 flex-grow">{s.descripcion}</p>
              <div className="flex gap-2 mt-auto">
                <button 
                  onClick={() => editarServicio(s)} 
                  className="flex-1 bg-blue-100 text-blue-700 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-200 transition-colors shadow-sm"
                >
                  Editar
                </button>
                <button 
                  onClick={() => eliminarServicio(s.id)} 
                  className="flex-1 bg-red-100 text-red-600 py-2.5 rounded-xl font-bold text-sm hover:bg-red-200 transition-colors shadow-sm"
                >
                  Borrar
                </button>
              </div>
            </div>
          </div>
        ))}
        {servicios.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-10">
            No hay servicios creados aún.
          </div>
        )}
      </div>
    </div>
  );
}
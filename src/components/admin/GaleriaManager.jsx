"use client";
import { useState, useRef } from "react";
import Swal from 'sweetalert2';
import Image from "next/image";

export default function GaleriaManager({ fotos, onRefresh }) {
  const [subiendo, setSubiendo] = useState(false);
  const fileInputRef = useRef(null);

  const subirFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSubiendo(true);
    const formData = new FormData();
    formData.append('foto', file);
    try {
      const res = await fetch('/api/galeria', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) { 
        onRefresh?.(); 
        Swal.fire('¡Éxito!', 'La foto se subió', 'success'); 
      } else throw new Error();
    } catch (error) { 
      Swal.fire('Error', 'Hubo un problema subiendo la foto', 'error'); 
    } finally {
      setSubiendo(false);
      if (fileInputRef.current) fileInputRef.current.value = ''; 
    }
  };

  const eliminarFoto = async (id, url) => {
    const { isConfirmed } = await Swal.fire({ 
      title: '¿Borrar esta foto?', 
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonColor: '#ef4444' 
    });
    if (!isConfirmed) return;
    try {
      const res = await fetch('/api/galeria', { 
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, url }) 
      });
      if (res.ok) { onRefresh?.(); Swal.fire('Eliminada', 'La foto se borró', 'success'); }
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al eliminar', 'error');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-lake-dark">Tus Trabajos 📸</h2>
          <p className="text-gray-500">Sube fotos para mostrar en la web.</p>
        </div>
        <div className="relative">
          <input 
            type="file" 
            accept="image/*" 
            onChange={subirFoto} 
            ref={fileInputRef} 
            className="hidden" 
            id="file-upload"
          />
          <label 
            htmlFor="file-upload" 
            className={`cursor-pointer font-bold py-3 px-6 rounded-full inline-block transition-all shadow-sm ${
              subiendo ? 'bg-gray-300 text-gray-500' : 'bg-lake-dark text-white hover:bg-gray-800 hover:scale-105'
            }`}
          >
            {subiendo ? '⏳ Subiendo...' : '➕ Subir Nueva Foto'}
          </label>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {fotos.map(foto => (
          <div key={foto.id} className="relative group rounded-xl overflow-hidden aspect-square border-2 border-gray-100 shadow-sm">
            <Image 
              src={foto.url} 
              alt="Trabajo" 
              fill
              className="object-cover" 
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={() => eliminarFoto(foto.id, foto.url)} 
                className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors shadow-lg"
              >
                🗑️ Borrar
              </button>
            </div>
          </div>
        ))}
        {fotos.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-20">
            No hay fotos en la galería aún.
          </div>
        )}
      </div>
    </div>
  );
}
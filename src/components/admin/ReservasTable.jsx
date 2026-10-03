"use client";
import { useState } from "react";
import Swal from 'sweetalert2';

const fmtFecha = (s) => s ? `${s.split("T")[0].split("-").reverse().join("/")} a las ${s.split("T")[1]}` : "";
const linkWA = (n) => `https://wa.me/56${(n||'').replace(/\D/g,'').slice(-9)}`;

export default function ReservasTable({ 
  reservas, 
  onRefresh, 
  onOpenModal, 
  onDelete 
}) {
  const [sel, setSel] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});

  const abrirModal = (r) => { 
    setSel(r); 
    setEditando(false); 
    setForm(r); 
    if (onOpenModal) onOpenModal(r);
  };

  const actualizarReserva = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reservas', { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form) 
      });
      if (res.ok) { 
        onRefresh?.(); 
        setSel(form); 
        setEditando(false); 
        Swal.fire('¡Actualizada!', '', 'success'); 
      }
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al actualizar', 'error');
    }
  };

  const eliminarReserva = async (id) => {
    const { isConfirmed } = await Swal.fire({ 
      title: '¿Eliminar cita?', 
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonColor: '#ef4444' 
    });
    if (!isConfirmed) return;
    
    try {
      const res = await fetch('/api/reservas', { 
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }) 
      });
      if (res.ok) { 
        onRefresh?.(); 
        setSel(null); 
        Swal.fire('¡Eliminada!', '', 'success'); 
      }
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al eliminar', 'error');
    }
  };

  if (reservas.length === 0) {
    return (
      <p className="col-span-full text-center text-gray-500 font-medium py-10">
        No hay reservas registradas.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reservas.map(r => (
          <div key={r.id} className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100 flex flex-col justify-between hover:border-lake-pink transition-all">
            <div>
              <span className="bg-lake-matcha text-lake-dark text-xs font-bold px-3 py-1 rounded-full uppercase truncate block w-max max-w-full">
                {r.servicio}
              </span>
              <h3 className="text-xl font-bold mt-4 capitalize">{r.nombre}</h3>
              <p className="text-gray-600 my-2 text-sm">🗓️ {fmtFecha(r.fecha_hora)}</p>
            </div>
            <button 
              onClick={() => abrirModal(r)} 
              className="w-full mt-5 bg-lake-pink font-bold text-lake-dark py-3 rounded-xl hover:bg-pink-300 transition-colors shadow-sm"
            >
              Administrar
            </button>
          </div>
        ))}
      </div>

      {sel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button 
              onClick={() => { setSel(null); if (onOpenModal) onOpenModal(null); }} 
              className="absolute top-4 right-5 text-gray-400 hover:text-lake-dark font-bold text-2xl transition-colors"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 border-b-2 border-lake-pink pb-3">
              {editando ? "Modificar Cita" : "Detalles"}
            </h2>
            {editando ? (
              <form onSubmit={actualizarReserva} className="flex flex-col gap-4 text-sm">
                <input 
                  type="text" 
                  value={form.nombre || ""} 
                  onChange={e=>setForm({...form, nombre: e.target.value})} 
                  className="w-full border-2 p-3 rounded-xl outline-none focus:border-lake-pink" 
                  required
                />
                <input 
                  type="text" 
                  value={form.servicio || ""} 
                  onChange={e=>setForm({...form, servicio: e.target.value})} 
                  className="w-full border-2 p-3 rounded-xl outline-none focus:border-lake-pink" 
                  required
                />
                <input 
                  type="datetime-local" 
                  value={form.fecha_hora || ""} 
                  onChange={e=>setForm({...form, fecha_hora: e.target.value})} 
                  className="w-full border-2 p-3 rounded-xl outline-none focus:border-lake-pink" 
                  required
                />
                <input 
                  type="text" 
                  value={form.whatsapp || ""} 
                  onChange={e=>setForm({...form, whatsapp: e.target.value})} 
                  className="w-full border-2 p-3 rounded-xl outline-none focus:border-lake-pink" 
                  required
                />
                <div className="flex gap-3 mt-2">
                  <button 
                    type="button" 
                    onClick={()=>setEditando(false)} 
                    className="w-1/2 bg-gray-200 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-300 transition-colors shadow-sm"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="w-1/2 bg-lake-pink py-3 rounded-xl font-bold text-lake-dark hover:bg-pink-300 transition-colors shadow-sm"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="space-y-4 mb-8 bg-lake-white p-5 rounded-2xl text-gray-700 border border-gray-100">
                  <p>👤 <strong>{sel.nombre}</strong></p>
                  <p>✨ <span className="capitalize">{sel.servicio}</span></p>
                  <p>📅 {fmtFecha(sel.fecha_hora)}</p>
                  <p>📱 {sel.whatsapp}</p>
                </div>
                <div className="flex gap-3 mb-4">
                  <button 
                    onClick={()=>setEditando(true)} 
                    className="w-1/2 bg-blue-100 text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-200 transition-colors shadow-sm"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={()=>eliminarReserva(sel.id)} 
                    className="w-1/2 bg-red-100 text-red-600 font-bold py-3 rounded-xl hover:bg-red-200 transition-colors shadow-sm"
                  >
                    Eliminar
                  </button>
                </div>
                {sel.whatsapp && (
                  <a 
                    href={linkWA(sel.whatsapp)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block text-center bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors shadow-md"
                  >
                    Escribir al WhatsApp
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
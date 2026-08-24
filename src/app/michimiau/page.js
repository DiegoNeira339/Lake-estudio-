"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Swal from 'sweetalert2';

const fmtFecha = (s) => s ? `${s.split("T")[0].split("-").reverse().join("/")} a las ${s.split("T")[1]}` : "";
const linkWA = (n) => `https://wa.me/56${(n||'').replace(/\D/g,'').slice(-9)}`;

export default function AdminDashboard() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const [sel, setSel] = useState(null); 
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    if (!auth) return;
    const fetchDatos = async () => {
      const res = await fetch('/api/reservas');
      const data = await res.json();
      if (res.ok) setReservas(data.reverse());
      setCargando(false);
    };
    fetchDatos();
  }, [auth]);

  const login = (e) => {
    e.preventDefault();
    pass === "lake2026" ? setAuth(true) : Swal.fire('Error', 'Clave incorrecta', 'error');
  };

  const eliminar = async (id) => {
    const { isConfirmed } = await Swal.fire({ title: '¿Eliminar cita?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444' });
    if (!isConfirmed) return;
    if ((await fetch('/api/reservas', { method: 'DELETE', body: JSON.stringify({ id }) })).ok) {
      setReservas(reservas.filter(r => r.id !== id));
      setSel(null);
      Swal.fire('¡Eliminada!', '', 'success');
    }
  };

  const actualizar = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/reservas', { method: 'PUT', body: JSON.stringify(form) });
    if (res.ok) {
      setReservas(reservas.map(r => r.id === form.id ? form : r));
      setSel(form); 
      setEditando(false);
      Swal.fire('¡Actualizada!', 'Los cambios se guardaron', 'success');
    }
  };

  const abrirModal = (r) => { setSel(r); setEditando(false); setForm(r); };

  if (!auth) return (
    <form onSubmit={login} className="min-h-screen bg-lake-pink flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-6 text-lake-dark">Gestión Lake Estudio 🌸</h2>
        <input type="password" placeholder="Contraseña" onChange={e => setPass(e.target.value)} className="w-full border-2 rounded-xl p-3 mb-4 text-center outline-none focus:border-lake-pink text-lake-dark" />
        <button className="w-full bg-lake-dark text-white font-bold py-3 rounded-xl mb-4 hover:bg-gray-800 transition-colors">Ingresar</button>
        <Link href="/" className="text-sm text-gray-500 hover:text-lake-dark underline transition-colors">Volver a la web</Link>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-lake-white p-6 md:p-12 relative text-lake-dark font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl font-bold tracking-wide">Panel de Reservas 🌸</h1>
          <button onClick={() => setAuth(false)} className="bg-gray-200 text-gray-700 py-2 px-6 rounded-full font-bold hover:bg-gray-300 transition-colors">Cerrar Sesión</button>
        </div>

        {cargando ? <p className="text-center text-xl mt-20 animate-pulse text-lake-dark">Cargando base de datos... ⏳</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservas.map(r => (
              <div key={r.id} className="bg-white rounded-3xl p-6 shadow-sm border-2 border-lake-pink flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <span className="bg-lake-matcha text-lake-dark text-xs font-bold px-3 py-1 rounded-full uppercase truncate block w-max max-w-full">{r.servicio}</span>
                  <h3 className="text-xl font-bold mt-4 capitalize">{r.nombre}</h3>
                  <p className="text-gray-600 my-2 text-sm">🗓️ {fmtFecha(r.fecha_hora)}</p>
                </div>
                <button onClick={() => abrirModal(r)} className="w-full mt-5 bg-lake-pink text-lake-dark font-bold py-3 rounded-xl hover:bg-pink-300 transition-colors">Administrar</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {sel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button onClick={() => setSel(null)} className="absolute top-4 right-5 text-gray-400 hover:text-lake-dark font-bold text-2xl">✕</button>
            <h2 className="text-2xl font-bold mb-6 border-b-2 border-lake-pink pb-3 text-lake-dark">
              {editando ? "Modificar Cita" : "Detalles del Cliente"}
            </h2>
            
            {editando ? (
              <form onSubmit={actualizar} className="flex flex-col gap-4 text-sm">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Nombre:</label>
                  <input type="text" value={form.nombre} onChange={e=>setForm({...form, nombre: e.target.value})} className="w-full border p-3 rounded-xl outline-none focus:border-lake-pink" required/>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Servicio:</label>
                  <input type="text" value={form.servicio} onChange={e=>setForm({...form, servicio: e.target.value})} className="w-full border p-3 rounded-xl outline-none focus:border-lake-pink" required/>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Fecha y Hora:</label>
                  <input type="datetime-local" value={form.fecha_hora} onChange={e=>setForm({...form, fecha_hora: e.target.value})} className="w-full border p-3 rounded-xl outline-none focus:border-lake-pink" required/>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">WhatsApp:</label>
                  <input type="text" value={form.whatsapp} onChange={e=>setForm({...form, whatsapp: e.target.value})} className="w-full border p-3 rounded-xl outline-none focus:border-lake-pink" required/>
                </div>
                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={()=>setEditando(false)} className="w-1/2 bg-gray-200 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors">Cancelar</button>
                  <button type="submit" className="w-1/2 bg-lake-pink text-lake-dark font-bold py-3 rounded-xl hover:bg-pink-300 transition-colors">Guardar</button>
                </div>
              </form>
            ) : (
              <>
                <div className="space-y-4 mb-8 text-gray-700 bg-lake-white p-5 rounded-2xl">
                  <p><span className="text-xl mr-2">👤</span> <strong>{sel.nombre}</strong></p>
                  <p><span className="text-xl mr-2">✨</span> <span className="capitalize">{sel.servicio}</span></p>
                  <p><span className="text-xl mr-2">📅</span> {fmtFecha(sel.fecha_hora)}</p>
                  <p><span className="text-xl mr-2">📱</span> {sel.whatsapp}</p>
                  <p><span className="text-xl mr-2">📧</span> <span className="text-sm truncate">{sel.email}</span></p>
                </div>
                <div className="flex gap-3 mb-4">
                  <button onClick={()=>setEditando(true)} className="w-1/2 bg-blue-100 text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-200 transition-colors">Editar</button>
                  <button onClick={()=>eliminar(sel.id)} className="w-1/2 bg-red-100 text-red-600 font-bold py-3 rounded-xl hover:bg-red-200 transition-colors">Eliminar</button>
                </div>
                {sel.whatsapp && <a href={linkWA(sel.whatsapp)} target="_blank" className="block text-center bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors shadow-sm">Escribir al WhatsApp</a>}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
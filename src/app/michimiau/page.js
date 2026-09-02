"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Swal from 'sweetalert2';

const fmtFecha = (s) => s ? `${s.split("T")[0].split("-").reverse().join("/")} a las ${s.split("T")[1]}` : "";
const linkWA = (n) => `https://wa.me/56${(n||'').replace(/\D/g,'').slice(-9)}`;

export default function AdminDashboard() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [vista, setVista] = useState('reservas');
  
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [sel, setSel] = useState(null); 
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});

  const [fotos, setFotos] = useState([]);
  const [subiendoGaleria, setSubiendoGaleria] = useState(false);
  const fileInputRef = useRef(null);

  const [servicios, setServicios] = useState([]);
  const [formServicio, setFormServicio] = useState({ id: null, titulo: '', precio: '', descripcion: '', foto_url: '', fotos_extra: '' });
  const [fotoServicio, setFotoServicio] = useState(null);
  const [fotosExtraServicio, setFotosExtraServicio] = useState([]);
  const [editandoServicio, setEditandoServicio] = useState(false);
  const [guardandoServicio, setGuardandoServicio] = useState(false);

  useEffect(() => {
    if (!auth) return;
    const fetchDatos = async () => {
      const resReservas = await fetch('/api/reservas');
      if (resReservas.ok) setReservas((await resReservas.json()).reverse());
      const resFotos = await fetch('/api/galeria');
      if (resFotos.ok) setFotos(await resFotos.json());
      const resServicios = await fetch('/api/servicios');
      if (resServicios.ok) setServicios(await resServicios.json());
      setCargando(false);
    };
    fetchDatos();
  }, [auth]);

  const totalCitasMes = reservas.filter(r => r.fecha_hora && new Date(r.fecha_hora).getMonth() === new Date().getMonth() && new Date(r.fecha_hora).getFullYear() === new Date().getFullYear()).length;
  const conteoServicios = reservas.reduce((acc, r) => { acc[r.servicio?.toLowerCase() || 'indefinido'] = (acc[r.servicio?.toLowerCase() || 'indefinido'] || 0) + 1; return acc; }, {});
  const servicioPopular = Object.keys(conteoServicios).length > 0 ? Object.keys(conteoServicios).reduce((a, b) => conteoServicios[a] > conteoServicios[b] ? a : b) : 'N/A';
  const gananciasFormateadas = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalCitasMes * 20000);

  const login = async (e) => { 
    e.preventDefault(); 
    Swal.fire({ title: 'Verificando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
      const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pass }) });
      if (res.ok) { Swal.close(); setAuth(true); } else Swal.fire('Alto ahí', 'Clave incorrecta o intruso detectado 🛑', 'error');
    } catch (error) { Swal.fire('Error', 'Hubo un problema de conexión', 'error'); }
  };
  
  const eliminarReserva = async (id) => {
    const { isConfirmed } = await Swal.fire({ title: '¿Eliminar cita?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444' });
    if (!isConfirmed) return;
    if ((await fetch('/api/reservas', { method: 'DELETE', body: JSON.stringify({ id }) })).ok) {
      setReservas(reservas.filter(r => r.id !== id)); setSel(null); Swal.fire('¡Eliminada!', '', 'success');
    }
  };

  const actualizarReserva = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/reservas', { method: 'PUT', body: JSON.stringify(form) });
    if (res.ok) { setReservas(reservas.map(r => r.id === form.id ? form : r)); setSel(form); setEditando(false); Swal.fire('¡Actualizada!', '', 'success'); }
  };
  const abrirModal = (r) => { setSel(r); setEditando(false); setForm(r); };

  const subirFotoGaleria = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSubiendoGaleria(true);
    const formData = new FormData();
    formData.append('foto', file);
    try {
      const res = await fetch('/api/galeria', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) { setFotos([{ id: Date.now(), url: data.url }, ...fotos]); Swal.fire('¡Éxito!', 'La foto se subió', 'success'); } else throw new Error();
    } catch (error) { Swal.fire('Error', 'Hubo un problema subiendo la foto', 'error'); } finally {
      setSubiendoGaleria(false);
      if (fileInputRef.current) fileInputRef.current.value = ''; 
    }
  };

  const eliminarFotoGaleria = async (id, url) => {
    const { isConfirmed } = await Swal.fire({ title: '¿Borrar esta foto?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444' });
    if (!isConfirmed) return;
    if ((await fetch('/api/galeria', { method: 'DELETE', body: JSON.stringify({ id, url }) })).ok) { setFotos(fotos.filter(f => f.id !== id)); Swal.fire('Eliminada', 'La foto se borró', 'success'); }
  };

  const resetFormServicio = () => {
    setFormServicio({ id: null, titulo: '', precio: '', descripcion: '', foto_url: '', fotos_extra: '' });
    setFotoServicio(null);
    setFotosExtraServicio([]);
    setEditandoServicio(false);
  };

  const guardarServicio = async (e) => {
    e.preventDefault();
    setGuardandoServicio(true);
    const formData = new FormData();
    if (formServicio.id) formData.append('id', formServicio.id);
    formData.append('titulo', formServicio.titulo);
    formData.append('precio', formServicio.precio);
    formData.append('descripcion', formServicio.descripcion);
    if (formServicio.foto_url) formData.append('foto_url', formServicio.foto_url);
    if (formServicio.fotos_extra) formData.append('fotos_extra_actuales', formServicio.fotos_extra);
    if (fotoServicio) formData.append('foto', fotoServicio);
    
    if (fotosExtraServicio) {
      for (let i = 0; i < fotosExtraServicio.length; i++) {
        formData.append('fotos_extra', fotosExtraServicio[i]);
      }
    }

    const metodo = editandoServicio ? 'PUT' : 'POST';
    try {
      const res = await fetch('/api/servicios', { method: metodo, body: formData });
      if (res.ok) {
        Swal.fire('¡Éxito!', `Servicio ${editandoServicio ? 'actualizado' : 'creado'}`, 'success');
        const resServ = await fetch('/api/servicios'); 
        if (resServ.ok) setServicios(await resServ.json());
        resetFormServicio();
      } else throw new Error();
    } catch (error) { Swal.fire('Error', 'Hubo un problema guardando el servicio', 'error'); } finally { setGuardandoServicio(false); }
  };

  const eliminarServicio = async (id) => {
    const { isConfirmed } = await Swal.fire({ title: '¿Borrar servicio?', text: "Desaparecerá de la página", icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444' });
    if (!isConfirmed) return;
    if ((await fetch('/api/servicios', { method: 'DELETE', body: JSON.stringify({ id }) })).ok) { setServicios(servicios.filter(s => s.id !== id)); Swal.fire('Eliminado', 'El servicio se borró', 'success'); }
  };

  if (!auth) return (
    <form onSubmit={login} className="min-h-screen bg-lake-pink flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-6 text-lake-dark">Gestión Lake Estudio 🌸</h2>
        <input type="password" placeholder="Contraseña secreta" onChange={e => setPass(e.target.value)} className="w-full border-2 rounded-xl p-3 mb-4 text-center outline-none focus:border-lake-pink text-lake-dark" />
        <button className="w-full bg-lake-dark text-white font-bold py-3 rounded-xl mb-4 hover:bg-gray-800 transition-colors shadow-md">Ingresar</button>
        <Link href="/" className="text-sm text-gray-500 hover:text-lake-dark underline transition-colors">Volver a la web</Link>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-lake-white p-6 md:p-12 relative text-lake-dark font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold tracking-wide">Panel de Control 🌸</h1>
          <button onClick={() => setAuth(false)} className="bg-gray-200 text-gray-700 py-2 px-6 rounded-full font-bold hover:bg-gray-300 transition-colors shadow-sm">Cerrar Sesión</button>
        </div>

        <div className="flex gap-4 mb-8 border-b-2 border-gray-200 pb-4 overflow-x-auto scrollbar-hide">
          <button onClick={() => setVista('reservas')} className={`font-bold px-6 py-2 rounded-full transition-colors whitespace-nowrap ${vista === 'reservas' ? 'bg-lake-dark text-white shadow-md' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>📅 Citas</button>
          <button onClick={() => setVista('galeria')} className={`font-bold px-6 py-2 rounded-full transition-colors whitespace-nowrap ${vista === 'galeria' ? 'bg-lake-dark text-white shadow-md' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>📸 Galería</button>
          <button onClick={() => setVista('servicios')} className={`font-bold px-6 py-2 rounded-full transition-colors whitespace-nowrap ${vista === 'servicios' ? 'bg-lake-dark text-white shadow-md' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>✨ Servicios</button>
        </div>

        {cargando ? <p className="text-center text-xl mt-20 animate-pulse text-lake-dark">Cargando datos... ⏳</p> : (
          <>
            {vista === 'reservas' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-lake-pink/20 border-2 border-lake-pink rounded-3xl p-6 flex items-center gap-4 shadow-sm"><div className="text-4xl">📅</div><div><p className="text-sm text-gray-600 font-bold uppercase">Citas este mes</p><p className="text-3xl font-extrabold text-lake-dark">{totalCitasMes}</p></div></div>
                  <div className="bg-lake-matcha/20 border-2 border-lake-matcha rounded-3xl p-6 flex items-center gap-4 shadow-sm"><div className="text-4xl">✨</div><div><p className="text-sm text-gray-600 font-bold uppercase">Servicio Estrella</p><p className="text-2xl font-extrabold text-lake-dark capitalize truncate">{servicioPopular}</p></div></div>
                  <div className="bg-blue-100 border-2 border-blue-200 rounded-3xl p-6 flex items-center gap-4 shadow-sm"><div className="text-4xl">💸</div><div><p className="text-sm text-gray-600 font-bold uppercase">Proyección Mes</p><p className="text-2xl font-extrabold text-lake-dark">{gananciasFormateadas}</p></div></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reservas.length === 0 ? <p className="col-span-full text-center text-gray-500 font-medium">No hay reservas registradas.</p> : (
                    reservas.map(r => (
                      <div key={r.id} className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100 flex flex-col justify-between hover:border-lake-pink transition-all">
                        <div>
                          <span className="bg-lake-matcha text-lake-dark text-xs font-bold px-3 py-1 rounded-full uppercase truncate block w-max max-w-full">{r.servicio}</span>
                          <h3 className="text-xl font-bold mt-4 capitalize">{r.nombre}</h3>
                          <p className="text-gray-600 my-2 text-sm">🗓️ {fmtFecha(r.fecha_hora)}</p>
                        </div>
                        <button onClick={() => abrirModal(r)} className="w-full mt-5 bg-lake-pink font-bold text-lake-dark py-3 rounded-xl hover:bg-pink-300 transition-colors shadow-sm">Administrar</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {vista === 'galeria' && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-lake-dark">Tus Trabajos 📸</h2>
                    <p className="text-gray-500">Sube fotos para mostrar en la web.</p>
                  </div>
                  <div className="relative">
                    <input type="file" accept="image/*" onChange={subirFotoGaleria} ref={fileInputRef} className="hidden" id="file-upload"/>
                    <label htmlFor="file-upload" className={`cursor-pointer font-bold py-3 px-6 rounded-full inline-block transition-all shadow-sm ${subiendoGaleria ? 'bg-gray-300 text-gray-500' : 'bg-lake-dark text-white hover:bg-gray-800 hover:scale-105'}`}>
                      {subiendoGaleria ? '⏳ Subiendo...' : '➕ Subir Nueva Foto'}
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {fotos.map(foto => (
                    <div key={foto.id} className="relative group rounded-xl overflow-hidden aspect-square border-2 border-gray-100 shadow-sm">
                      <img src={foto.url} alt="Trabajo" className="object-cover w-full h-full" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={() => eliminarFotoGaleria(foto.id, foto.url)} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors shadow-lg">🗑️ Borrar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {vista === 'servicios' && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-gray-100">
                <h2 className="text-2xl font-bold text-lake-dark mb-2">Gestión de Servicios ✨</h2>
                <p className="text-gray-500 mb-8">Estos son los servicios que las clientas verán en la página principal.</p>

                <form onSubmit={guardarServicio} className="mb-12 bg-lake-pink/10 p-6 rounded-3xl border-2 border-lake-pink/30">
                  <h3 className="font-bold text-xl mb-4 text-lake-dark">{editandoServicio ? '✏️ Editar Servicio' : '➕ Crear Nuevo Servicio'}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Título (Ej: Limpieza Facial)" value={formServicio.titulo || ""} onChange={e => setFormServicio({...formServicio, titulo: e.target.value})} className="border-2 p-3 rounded-xl w-full outline-none focus:border-lake-pink bg-white shadow-sm" required />
                    <input type="text" placeholder="Precio (Ej: 20.000)" value={formServicio.precio || ""} onChange={e => setFormServicio({...formServicio, precio: e.target.value})} className="border-2 p-3 rounded-xl w-full outline-none focus:border-lake-pink bg-white shadow-sm" required />
                    
                    <div className="relative">
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Foto de Portada</label>
                      <input type="file" accept="image/*" onChange={e => setFotoServicio(e.target.files[0])} className="border-2 p-2 rounded-xl w-full bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-lake-pink file:text-lake-dark hover:file:bg-pink-300 shadow-sm cursor-pointer" />
                    </div>

                    <div className="relative">
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Fotos Adicionales (Opcional - Carrusel)</label>
                      <input type="file" accept="image/*" multiple onChange={e => setFotosExtraServicio(e.target.files)} className="border-2 p-2 rounded-xl w-full bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-lake-dark hover:file:bg-gray-300 shadow-sm cursor-pointer" />
                      
                      {editandoServicio && formServicio.fotos_extra && formServicio.fotos_extra.length > 0 && (
                        <div className="mt-3 p-3 bg-white rounded-xl border-2 border-gray-100 shadow-sm">
                          <p className="text-xs font-bold text-gray-500 mb-2">Fotos actuales en el carrusel (Clic para borrar):</p>
                          <div className="flex gap-2 flex-wrap">
                            {formServicio.fotos_extra.split(',').filter(Boolean).map((url, idx) => (
                              <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden shadow-sm group border border-gray-200 cursor-pointer" onClick={() => {
                                const nuevas = formServicio.fotos_extra.split(',').filter(u => u !== url).join(',');
                                setFormServicio({...formServicio, fotos_extra: nuevas});
                              }}>
                                <img src={url} alt="Extra" className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-red-600 font-extrabold text-2xl">✕</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <textarea placeholder="Descripción del servicio" value={formServicio.descripcion || ""} onChange={e => setFormServicio({...formServicio, descripcion: e.target.value})} className="border-2 p-3 rounded-xl w-full md:col-span-2 outline-none focus:border-lake-pink bg-white resize-none shadow-sm" required rows="3"></textarea>
                  </div>

                  <div className="mt-6 flex gap-3">
                    {editandoServicio && (
                      <button type="button" onClick={resetFormServicio} className="w-1/3 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors shadow-sm">Cancelar</button>
                    )}
                    <button type="submit" disabled={guardandoServicio} className={`${editandoServicio ? 'w-2/3' : 'w-full'} bg-lake-dark text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-400 shadow-sm`}>
                      {guardandoServicio ? '⏳ Guardando...' : (editandoServicio ? 'Guardar Cambios' : 'Crear Servicio')}
                    </button>
                  </div>
                </form>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {servicios.map(s => (
                    <div key={s.id} className="border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:border-lake-matcha transition-colors flex flex-col h-full bg-white group">
                      <div className="h-48 relative bg-gray-100 overflow-hidden">
                        {s.foto_url ? <img src={s.foto_url} alt={s.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="flex items-center justify-center h-full text-gray-400 font-medium">Sin foto 📷</div>}
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h4 className="font-bold text-xl mb-1 capitalize text-lake-dark">{s.titulo}</h4>
                        <p className="text-pink-500 font-bold mb-4">${s.precio}</p>
                        <p className="text-sm text-gray-600 mb-6 flex-grow">{s.descripcion}</p>
                        <div className="flex gap-2 mt-auto">
                          <button onClick={() => { setFormServicio(s); setEditandoServicio(true); setFotoServicio(null); setFotosExtraServicio([]); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex-1 bg-blue-100 text-blue-700 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-200 transition-colors shadow-sm">Editar</button>
                          <button onClick={() => eliminarServicio(s.id)} className="flex-1 bg-red-100 text-red-600 py-2.5 rounded-xl font-bold text-sm hover:bg-red-200 transition-colors shadow-sm">Borrar</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {sel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button onClick={() => setSel(null)} className="absolute top-4 right-5 text-gray-400 hover:text-lake-dark font-bold text-2xl transition-colors">✕</button>
            <h2 className="text-2xl font-bold mb-6 border-b-2 border-lake-pink pb-3">{editando ? "Modificar Cita" : "Detalles"}</h2>
            {editando ? (
              <form onSubmit={actualizarReserva} className="flex flex-col gap-4 text-sm">
                <input type="text" value={form.nombre || ""} onChange={e=>setForm({...form, nombre: e.target.value})} className="w-full border-2 p-3 rounded-xl outline-none focus:border-lake-pink" required/>
                <input type="text" value={form.servicio || ""} onChange={e=>setForm({...form, servicio: e.target.value})} className="w-full border-2 p-3 rounded-xl outline-none focus:border-lake-pink" required/>
                <input type="datetime-local" value={form.fecha_hora || ""} onChange={e=>setForm({...form, fecha_hora: e.target.value})} className="w-full border-2 p-3 rounded-xl outline-none focus:border-lake-pink" required/>
                <input type="text" value={form.whatsapp || ""} onChange={e=>setForm({...form, whatsapp: e.target.value})} className="w-full border-2 p-3 rounded-xl outline-none focus:border-lake-pink" required/>
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={()=>setEditando(false)} className="w-1/2 bg-gray-200 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-300 transition-colors shadow-sm">Cancelar</button>
                  <button type="submit" className="w-1/2 bg-lake-pink py-3 rounded-xl font-bold text-lake-dark hover:bg-pink-300 transition-colors shadow-sm">Guardar</button>
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
                  <button onClick={()=>setEditando(true)} className="w-1/2 bg-blue-100 text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-200 transition-colors shadow-sm">Editar</button>
                  <button onClick={()=>eliminarReserva(sel.id)} className="w-1/2 bg-red-100 text-red-600 font-bold py-3 rounded-xl hover:bg-red-200 transition-colors shadow-sm">Eliminar</button>
                </div>
                {sel.whatsapp && <a href={linkWA(sel.whatsapp)} target="_blank" rel="noopener noreferrer" className="block text-center bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors shadow-md">Escribir al WhatsApp</a>}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
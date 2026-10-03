"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Swal from 'sweetalert2';
import AdminTabs from "@/components/admin/AdminTabs";
import StatCard from "@/components/admin/StatCard";
import ReservasTable from "@/components/admin/ReservasTable";
import GaleriaManager from "@/components/admin/GaleriaManager";
import ServiciosManager from "@/components/admin/ServiciosManager";
import HorariosManager from "@/components/admin/HorariosManager";

export default function AdminDashboard() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [vista, setVista] = useState('reservas');
  
  const [reservas, setReservas] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  const login = async (e) => { 
    e.preventDefault(); 
    Swal.fire({ title: 'Verificando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
      const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pass }) });
      if (res.ok) { Swal.close(); setAuth(true); } else Swal.fire('Alto ahí', 'Clave incorrecta o intruso detectado 🛑', 'error');
    } catch (error) { Swal.fire('Error', 'Hubo un problema de conexión', 'error'); }
  };

  useEffect(() => {
    if (!auth) return;
    const fetchDatos = async () => {
      try {
        const [resReservas, resFotos, resServicios, resHorarios] = await Promise.all([
          fetch('/api/reservas'),
          fetch('/api/galeria'),
          fetch('/api/servicios'),
          fetch('/api/horarios'),
        ]);
        
        if (resReservas.ok) setReservas((await resReservas.json()).reverse());
        if (resFotos.ok) setFotos(await resFotos.json());
        if (resServicios.ok) setServicios(await resServicios.json());
        if (resHorarios.ok) setHorarios(await resHorarios.json());
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchDatos();
  }, [auth]);

  const refrescarReservas = async () => {
    const res = await fetch('/api/reservas');
    if (res.ok) setReservas((await res.json()).reverse());
  };

  const refrescarFotos = async () => {
    const res = await fetch('/api/galeria');
    if (res.ok) setFotos(await res.json());
  };

  const refrescarServicios = async () => {
    const res = await fetch('/api/servicios');
    if (res.ok) setServicios(await res.json());
  };

  const refrescarHorarios = async () => {
    const res = await fetch('/api/horarios');
    if (res.ok) setHorarios(await res.json());
  };

  const totalCitasMes = reservas.filter(r => r.fecha_hora && new Date(r.fecha_hora).getMonth() === new Date().getMonth() && new Date(r.fecha_hora).getFullYear() === new Date().getFullYear()).length;
  const conteoServicios = reservas.reduce((acc, r) => { acc[r.servicio?.toLowerCase() || 'indefinido'] = (acc[r.servicio?.toLowerCase() || 'indefinido'] || 0) + 1; return acc; }, {});
  const servicioPopular = Object.keys(conteoServicios).length > 0 ? Object.keys(conteoServicios).reduce((a, b) => conteoServicios[a] > conteoServicios[b] ? a : b) : 'N/A';
  const gananciasFormateadas = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalCitasMes * 20000);

  const stats = {
    reservasCount: reservas.length,
    fotosCount: fotos.length,
    serviciosCount: servicios.length,
    horariosCount: horarios.length,
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

        <AdminTabs activeTab={vista} onTabChange={setVista} stats={stats} />

        {cargando ? (
          <p className="text-center text-xl mt-20 animate-pulse text-lake-dark">Cargando datos... ⏳</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <StatCard icon="📅" label="Citas este mes" value={totalCitasMes} bgClass="bg-lake-pink/20" borderClass="border-lake-pink" />
              <StatCard icon="✨" label="Servicio Estrella" value={servicioPopular} bgClass="bg-lake-matcha/20" borderClass="border-lake-matcha" iconSize="text-4xl" />
              <StatCard icon="💸" label="Proyección Mes" value={gananciasFormateadas} bgClass="bg-blue-100" borderClass="border-blue-200" />
            </div>

            {vista === 'reservas' && (
              <ReservasTable 
                reservas={reservas} 
                onRefresh={refrescarReservas} 
              />
            )}

            {vista === 'galeria' && (
              <GaleriaManager 
                fotos={fotos} 
                onRefresh={refrescarFotos} 
              />
            )}

            {vista === 'servicios' && (
              <ServiciosManager 
                servicios={servicios} 
                onRefresh={refrescarServicios} 
              />
            )}

            {vista === 'horarios' && (
              <HorariosManager 
                horarios={horarios} 
                onRefresh={refrescarHorarios} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
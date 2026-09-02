"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Services() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(null);
  const [indiceFoto, setIndiceFoto] = useState(0);
  const [zoomAbierto, setZoomAbierto] = useState(false);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const res = await fetch('/api/servicios');
        if (res.ok) setServicios(await res.json());
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    };
    fetchServicios();
  }, []);

  const abrirModal = (servicio) => {
    setModalAbierto(servicio);
    setIndiceFoto(0);
  };

  const obtenerFotos = (srv) => {
    if (!srv) return [];
    const fotos = [];
    if (srv.foto_url) fotos.push(srv.foto_url);
    if (srv.fotos_extra) fotos.push(...srv.fotos_extra.split(',').filter(Boolean));
    return fotos;
  };

  const fotosCarrusel = obtenerFotos(modalAbierto);

  return (
    <section className="py-20 bg-lake-white w-full px-6" id="servicios">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-lake-dark mb-4">Nuestros Servicios 🌸</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Descubre todo lo que Lake Estudio tiene para ofrecerte.</p>
        </div>

        {cargando ? (
          <div className="text-center text-lake-dark animate-pulse text-xl font-bold py-10">Cargando servicios... ✨</div>
        ) : servicios.length === 0 ? (
          <div className="text-center text-gray-500 py-10">Aún no hay servicios disponibles.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicios.map(servicio => (
              <div key={servicio.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border-2 border-lake-pink/20 hover:border-lake-pink transition-all flex flex-col group">
                <div className="h-64 relative overflow-hidden bg-gray-100">
                  {servicio.foto_url ? (
                    <img src={servicio.foto_url} alt={servicio.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">Sin imagen</div>
                  )}
                  <span className="absolute top-4 left-4 bg-lake-matcha text-lake-dark text-xs font-bold px-3 py-1 rounded-full shadow-sm">Estética</span>
                </div>
                
                <div className="p-8 flex flex-col flex-grow text-center items-center">
                  <h3 className="text-2xl font-bold text-lake-dark mb-2 capitalize">{servicio.titulo}</h3>
                  <p className="text-xl font-extrabold text-pink-500 mb-4">${servicio.precio}</p>
                  <p className="text-gray-600 mb-6 flex-grow line-clamp-3">{servicio.descripcion}</p>
                  <button onClick={() => abrirModal(servicio)} className="text-lake-dark font-bold underline decoration-2 decoration-lake-pink hover:text-pink-600 transition-colors">
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalAbierto && (
        <div 
          className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setModalAbierto(null)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setModalAbierto(null)} className="absolute top-4 right-4 bg-white text-lake-dark w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-md hover:bg-gray-100 z-30 transition-colors">✕</button>

            <div className="h-72 w-full bg-gray-100 relative shrink-0 group">
               {fotosCarrusel.length > 0 ? (
                  <>
                    <img onClick={() => setZoomAbierto(true)} src={fotosCarrusel[indiceFoto]} alt="Servicio" className="w-full h-full object-cover cursor-zoom-in" />
                    {fotosCarrusel.length > 1 && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); setIndiceFoto(indiceFoto === 0 ? fotosCarrusel.length - 1 : indiceFoto - 1); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lake-dark shadow-md hover:bg-white z-20">◀</button>
                        <button onClick={(e) => { e.stopPropagation(); setIndiceFoto(indiceFoto === fotosCarrusel.length - 1 ? 0 : indiceFoto + 1); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lake-dark shadow-md hover:bg-white z-20">▶</button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full z-20 font-bold tracking-widest">
                          {indiceFoto + 1} / {fotosCarrusel.length}
                        </div>
                      </>
                    )}
                  </>
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Sin foto</div>
               )}
            </div>

            <div className="p-8 overflow-y-auto">
              <h3 className="text-3xl font-extrabold text-lake-dark mb-2 capitalize">{modalAbierto.titulo}</h3>
              <p className="text-2xl font-bold text-pink-500 mb-4">${modalAbierto.precio}</p>
              <p className="text-gray-700 text-lg mb-8 leading-relaxed whitespace-pre-wrap">{modalAbierto.descripcion}</p>
              <Link href="/agendar" onClick={() => setModalAbierto(null)} className="block text-center w-full bg-lake-pink text-lake-dark font-extrabold text-lg py-4 rounded-full hover:bg-pink-300 hover:scale-[1.02] transition-all shadow-md">
                📅 Reservar este servicio
              </Link>
            </div>
          </div>
        </div>
      )}

      {zoomAbierto && fotosCarrusel.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setZoomAbierto(false)}>
          <button onClick={() => setZoomAbierto(false)} className="absolute top-6 right-6 text-white text-4xl font-bold hover:text-lake-pink transition-colors">✕</button>
          <img src={fotosCarrusel[indiceFoto]} alt="Zoom" className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" />
        </div>
      )}
    </section>
  );
}
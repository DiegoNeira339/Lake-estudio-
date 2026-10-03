"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function GaleriaTrabajos() {
  const [fotos, setFotos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [fotoExpandida, setFotoExpandida] = useState(null);

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        const res = await fetch('/api/galeria');
        if (res.ok) {
          const data = await res.json();
          setFotos(data);
        }
      } catch (error) {
        console.error("Error cargando la galería:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchFotos();
  }, []);

  const SkeletonImage = () => (
    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden skeleton group cursor-pointer" />
  );

  if (cargando) {
    return (
      <section className="py-16 bg-gradient-section px-6 border-t border-lake-pink/20" aria-busy="true" aria-label="Cargando galería">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-lake-dark mb-3 font-display">
              Nuestros Trabajos 🌸
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Un vistazo a los resultados y la dedicación que ponemos en cada detalle.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonImage key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (fotos.length === 0) return null; 

  return (
    <section className="py-16 bg-gradient-section px-6 border-t border-lake-pink/20">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-lake-dark mb-3 font-display">
            Nuestros Trabajos 🌸
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Un vistazo a los resultados y la dedicación que ponemos en cada detalle.
          </p>
        </div>

        {/* Grilla de fotos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {fotos.map(foto => (
            <div 
              key={foto.id} 
              onClick={() => setFotoExpandida(foto.url)}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm hover:shadow-elevated transition-all duration-300 group border-2 border-transparent hover:border-lake-pink/50 cursor-pointer"
            >
              <Image 
                src={foto.url} 
                alt="Trabajo de Lake Estudio" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
          ))}
        </div>

      </div>

      {/* ==========================================
          MODAL LIGHTBOX (FOTO EXPANDIDA) 
          ========================================== */}
      {fotoExpandida && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-xl cursor-pointer animate-fade-in"
          onClick={() => setFotoExpandida(null)}
        >
          {/* Botón de cerrar (X) */}
          <button 
            onClick={() => setFotoExpandida(null)}
            className="absolute top-6 right-8 text-white text-4xl font-bold hover:text-lake-pink transition-colors bg-white/10 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center"
            aria-label="Cerrar imagen"
          >
            &times;
          </button>
          
          {/* Imagen en grande */}
          <img 
            src={fotoExpandida} 
            alt="Trabajo ampliado" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-floating animate-scale-in cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
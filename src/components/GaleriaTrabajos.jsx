"use client";
import { useState, useEffect } from "react";

export default function GaleriaTrabajos() {
  const [fotos, setFotos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [fotoExpandida, setFotoExpandida] = useState(null); // Estado para la foto en grande

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

  if (cargando) return <div className="text-center py-12 text-lake-dark animate-pulse">Cargando galería... ✨</div>;
  if (fotos.length === 0) return null; 

  return (
    <section className="py-16 bg-lake-white px-6 border-t border-lake-pink/20">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-lake-dark mb-3">
            Nuestros Trabajos 🌸
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Un vistazo a los resultados y la dedicación que ponemos en cada detalle.
          </p>
        </div>

        {/* Grilla de fotos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fotos.map(foto => (
            <div 
              key={foto.id} 
              onClick={() => setFotoExpandida(foto.url)} // Al hacer clic, guardamos la URL
              className="relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border-2 border-transparent hover:border-lake-pink cursor-pointer"
            >
              <img 
                src={foto.url} 
                alt="Trabajo de Lake Estudio" 
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" 
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
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer"
          onClick={() => setFotoExpandida(null)} // Cierra al hacer clic en el fondo negro
        >
          {/* Botón de cerrar (X) */}
          <span className="absolute top-6 right-8 text-white text-4xl font-bold hover:text-lake-pink transition-colors">
            &times;
          </span>
          
          {/* Imagen en grande */}
          <img 
            src={fotoExpandida} 
            alt="Trabajo ampliado" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()} // Evita que se cierre si haces clic justo en la imagen
          />
        </div>
      )}
    </section>
  );
}
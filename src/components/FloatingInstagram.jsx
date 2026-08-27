"use client";
import Link from "next/link";

export default function FloatingInstagram() {
  const instagramUrl = "https://www.instagram.com/lakestudio.cl";

  return (
    <Link 
      href={instagramUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center group"
      aria-label="Ir a nuestro Instagram"
    >
      {/* Ícono de Instagram dibujado con SVG (para no instalar librerías extra) */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="30" 
        height="30" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
      
      {/* Mensaje oculto que aparece al pasar el mouse por encima */}
      <span className="absolute right-16 bg-white text-lake-dark text-sm font-bold px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none border-2 border-lake-pink/30">
        ¡Hablemos por DM! ✨
      </span>
    </Link>
  );
}
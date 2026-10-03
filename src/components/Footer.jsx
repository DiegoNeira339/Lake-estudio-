"use client";
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  
  if (pathname === '/michimiau') return null;

  return (
    <footer className="w-full bg-gradient-footer border-t border-lake-pink/20 py-10 px-6 mt-auto relative">
      {/* Decorative divider at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-6 -mt-3" aria-hidden="true">
        <svg viewBox="0 0 1200 30" fill="none" className="w-full h-full text-lake-pink/30" preserveAspectRatio="none">
          <path d="M0,15 C300,30 600,0 900,15 C1200,30 1200,30 1200,30 L0,30 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left text-lake-dark relative z-10 pt-4">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-2xl font-extrabold tracking-tight font-display">Lake Estudio 🌸</span>
          <p className="opacity-80 text-sm mt-2 max-w-xs">
            Recuerda que tu cita se confirma definitivamente tras el pago del anticipo coordinado por WhatsApp.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-start gap-2">
          <h4 className="font-bold text-lg mb-2">Contacto</h4>
          <a 
            href="https://www.instagram.com/lakestudio.cl?igsh=cmNmOXNvaDk3eHlv" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="opacity-80 hover:font-bold hover:scale-105 transition-all text-lake-dark hover:text-lake-matcha"
          >
            Instagram 
          </a>
        </div>

        <div className="flex flex-col items-center md:items-start gap-2">
          <h4 className="font-bold text-lg mb-2">Ubicación</h4>
          <p className="opacity-80 text-sm">
            Estudio Privado<br/>
            Santiago, Chile
          </p>
        </div>

      </div>

      <div className="text-center text-sm opacity-60 mt-12">
        © {new Date().getFullYear()} Lake Estudio. Todos los derechos reservados.
      </div>
    </footer>
  );
}
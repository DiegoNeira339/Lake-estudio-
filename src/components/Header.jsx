"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  if (pathname === '/michimiau') return null;

  return (
    <header className="w-full px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 sticky top-0 z-50 bg-lake-pink/80 backdrop-blur-md border-b border-lake-pink/20">
      
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <Image 
          src="/logo_lake.jpeg" 
          alt="Logo Lake Estudio"
          width={50} 
          height={50}
          className="rounded-full object-cover shadow-soft border-2 border-lake-white/50"
        />
        <span className="text-2xl font-extrabold text-lake-dark tracking-tight font-display">Lake Estudio</span>
      </Link>

      <nav className="flex items-center gap-2 font-medium text-lake-dark" aria-label="Navegación principal">
        <Link 
          href="/" 
          className="relative px-4 py-2 rounded-full hover:text-lake-dark transition-colors after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-lake-matcha hover:after:w-3/4 after:rounded-full after:transition-all"
        >
          Inicio
        </Link>
        <Link 
          href="/nosotros" 
          className="relative px-4 py-2 rounded-full hover:text-lake-dark transition-colors after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-lake-matcha hover:after:w-3/4 after:rounded-full after:transition-all"
        >
          Acerca de nosotros
        </Link>
        <Link 
          href="/#servicios" 
          className="relative px-4 py-2 rounded-full hover:text-lake-dark transition-colors after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-lake-matcha hover:after:w-3/4 after:rounded-full after:transition-all"
        >
          Servicios
        </Link>
      </nav>

      <Link 
        href="/agendar" 
        className="bg-lake-matcha text-lake-dark px-6 py-2.5 rounded-full font-bold shadow-soft hover:shadow-glow hover:scale-[1.02] transition-all duration-300 active:scale-[0.98]"
      >
        Agendar Cita
      </Link>
      
    </header>
  );
}
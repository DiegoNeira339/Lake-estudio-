"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  if (pathname === '/michimiau') return null;

  return (
    <header className="w-full bg-lake-pink px-6 py-4 flex flex-col md:flex-row items-center justify-between shadow-sm gap-4 md:gap-0 sticky top-0 z-50">
      
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <Image 
          src="/logo_lake.jpeg" 
          alt="Logo Lake Estudio"
          width={50} 
          height={50}
          className="rounded-full object-cover shadow-sm border-2 border-lake-white"
        />
        <span className="text-2xl font-extrabold text-lake-dark tracking-tight">Lake Estudio</span>
      </Link>

      <nav className="flex items-center gap-6 font-medium text-lake-dark">
        <Link href="/" className="hover:text-white transition-colors">
          Inicio
        </Link>
        <Link href="/nosotros" className="hover:text-white transition-colors">
          Acerca de nosotros
        </Link>
        <Link href="/#servicios" className="hover:text-white transition-colors">
          Servicios
        </Link>
      </nav>

      <Link 
        href="/agendar" 
        className="bg-lake-matcha text-lake-dark px-6 py-2 rounded-full font-bold shadow-sm hover:scale-105 transition-all"
      >
        Agendar Cita
      </Link>
      
    </header>
  );
}
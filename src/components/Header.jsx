import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-lake-pink px-6 py-4 flex flex-col md:flex-row items-center justify-between shadow-sm gap-4 md:gap-0 sticky top-0 z-50">
      
      {/* 1. LOGO Y NOMBRE (A LA IZQUIERDA) */}
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

      {/* 2. NAVEGACIÓN (AL CENTRO) */}
      <nav className="flex items-center gap-6 font-medium text-lake-dark">
        <Link href="/" className="hover:text-white transition-colors">
          Inicio
        </Link>
        <Link href="/#servicios" className="hover:text-white transition-colors">
          Pelo
        </Link>
        <Link href="/#servicios" className="hover:text-white transition-colors">
          Estética
        </Link>
      </nav>

      {/* 3. BOTÓN DE AGENDAR (A LA DERECHA) */}
      <Link 
        href="/agendar" 
        className="bg-lake-matcha text-lake-dark px-6 py-2 rounded-full font-bold shadow-sm hover:scale-105 transition-all"
      >
        Agendar Cita
      </Link>
      
    </header>
  );
}
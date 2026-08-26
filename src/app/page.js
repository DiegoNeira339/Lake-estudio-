import Link from "next/link";
import Services from "../components/Services";
import GaleriaTrabajos from "../components/GaleriaTrabajos";

export default function Home() {
  return (
    <main className="min-h-screen bg-lake-white font-sans flex flex-col items-center">
      
      {/* SECCIÓN 1: HERO */}
      <section id="inicio" className="w-full flex flex-col items-center justify-center text-center px-6 py-24 bg-lake-pink">
        <h1 className="text-5xl md:text-7xl font-extrabold text-lake-dark mb-6 tracking-tight">
          Realza tu belleza <br/> natural 🌸
        </h1>
        <p className="text-lake-dark text-lg md:text-xl max-w-2xl opacity-80 mb-10">
          Especialistas en alisados, estética integral y cuidado personal.
          Reserva tu espacio y déjate regalonear en Lake Estudio.
        </p>
        <Link href="/agendar" className="bg-lake-matcha text-lake-dark px-10 py-4 rounded-full font-bold text-lg shadow-sm hover:scale-105 transition-all">
          Agendar Cita Ahora
        </Link>
      </section>

      {/* SECCIÓN 2: SERVICIOS */}
      <Services />

      {/* SECCIÓN 3: GALERÍA DE TRABAJOS */} 
      <GaleriaTrabajos /> 

    </main>
  );
}   
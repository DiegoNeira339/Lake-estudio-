import Link from "next/link";
import Services from "../components/Services";
import GaleriaTrabajos from "../components/GaleriaTrabajos";
import Faq from '@/components/Faq';

export default function Home() {
  return (
    <main className="min-h-screen bg-lake-white font-sans flex flex-col items-center">
      
      <section id="inicio" className="w-full flex flex-col items-center justify-center text-center px-6 py-24 bg-lake-pink">
        <h1 className="text-5xl md:text-7xl font-extrabold text-lake-dark mb-6 tracking-tight max-w-4xl mx-auto text-balance">
          Realza tu belleza <span className="whitespace-nowrap">natural 🌸</span>
        </h1>
        <p className="text-lake-dark text-lg md:text-xl max-w-2xl opacity-80 mb-10 text-balance">
          Especialistas en alisados, estética integral y cuidado personal.
          Reserva tu espacio y déjate regalonear en Lake Estudio.
        </p>
        <Link href="/agendar" className="bg-lake-matcha text-lake-dark px-10 py-4 rounded-full font-bold text-lg shadow-sm hover:scale-105 transition-all">
          Agendar Cita Ahora
        </Link>
      </section>

      <Services />

      <GaleriaTrabajos /> 

      <Faq />

    </main>
  );
}
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Services from "../components/Services";
import GaleriaTrabajos from "../components/GaleriaTrabajos";
import Faq from '@/components/Faq';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
  };

  return (
    <main className="min-h-screen bg-lake-white font-sans flex flex-col items-center">
      
      <section id="inicio" className="w-full relative flex flex-col items-center justify-center text-center px-6 py-20 md:py-28 bg-gradient-hero overflow-hidden">
        {/* Decorative subtle blob background */}
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-lake-pink/30 blur-3xl animate-pulse" style={{animationDuration: '4s'}} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-lake-matcha/20 blur-3xl animate-pulse" style={{animationDuration: '5s', animationDelay: '1s'}} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-lake-lilac/15 blur-3xl" />
        </div>

        <motion.div 
          className="max-w-4xl mx-auto w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-lake-dark mb-6 tracking-tight text-balance font-display leading-[1.1]"
            variants={itemVariants}
          >
            Realza tu belleza <span className="whitespace-nowrap text-lake-matcha">natural ✨</span>
          </motion.h1>
          <motion.p 
            className="text-lake-dark text-lg md:text-xl max-w-2xl mx-auto opacity-80 mb-10 text-balance leading-relaxed"
            variants={itemVariants}
          >
            Especialistas en alisados, estética integral y cuidado personal.
            Reserva tu espacio y déjate regalonear en Lake Estudio.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link 
              href="/agendar" 
              className="inline-flex items-center gap-2 bg-lake-matcha text-lake-dark px-10 py-4 rounded-full font-bold text-lg shadow-soft hover:shadow-glow hover:scale-[1.02] transition-all duration-300 active:scale-[0.98]"
            >
              Agendar Cita Ahora
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* Decorative divider */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-8" aria-hidden="true">
          <svg viewBox="0 0 1200 40" fill="none" className="w-full h-full text-lake-pink/50" preserveAspectRatio="none">
            <path d="M0,20 C300,40 600,0 900,20 C1200,40 1200,40 1200,40 L0,40 Z" fill="currentColor" />
          </svg>
        </div>
      </section>

      <Services />

      <GaleriaTrabajos /> 

      <Faq />

    </main>
  );
}
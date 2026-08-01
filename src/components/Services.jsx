"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Services() {
  const [selectedService, setSelectedService] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const servicesList = [
    {
      id: 1,
      title: "Alisado Profesional",
      description: "Luce un cabello liso, brillante y sin frizz por meses. Trabajamos con productos de alta calidad.",
      detalleFull: "Nuestro alisado profesional incluye lavado de limpieza profunda, aplicación del producto alisante, sellado térmico y un masaje capilar de hidratación. Ideal para olvidarte de la plancha.",
      media: "/alisado_1.mp4",
      isVideo: true,
      category: "Pelo",
      gallery: [
        { src: "/alisado_1.mp4", type: "video" },
        { src: "/alisado_2.mp4", type: "video" }
      ]
    },
    {
      id: 2,
      title: "Limpieza Facial",
      description: "Protocolo de 5 pasos para renovar tu rostro. Opción a sumar drenaje o masaje reafirmante.",
      detalleFull: "El servicio base ($20.000) incluye:\n1. Higiene facial\n2. Exfoliación enzimática\n3. Desincrustación\n4. Mascarilla calmante\n5. Sellado\n\n✨ Extras ($5.000 c/u):\nPuedes complementar tu limpieza con un Drenaje Linfático o un Masaje Integral Reafirmante.",
      media: "/despues_limpieza.jpeg", 
      isVideo: false,
      category: "Estética",
      gallery: [
        { src: "/antes_limpieza.jpeg", type: "image" },
        { src: "/despues_limpieza.jpeg", type: "image" }
      ]
    },
    {
      id: 3,
      title: "Diseño de Cejas",
      description: "Enmarca tu mirada con un perfilado adaptado a la forma y facciones de tu rostro.",
      detalleFull: "Realizamos un servicio especializado en tus cejas para resaltar tu mirada y armonizar las facciones de tu rostro. Cuidamos cada detalle para entregarte un resultado simétrico, natural y perfecto.",
      media: "/cejas_3.jpeg", 
      isVideo: false,
      category: "Estética",
      gallery: [
        { src: "/cejas_3.jpeg", type: "image" },
        { src: "/cejas_2.jpeg", type: "image" },
        { src: "/cejas_1.jpeg", type: "image" }
      ]
    }
  ];

  
  const handleOpenModal = (service) => {
    setSelectedService(service);
    setCurrentIndex(0); 
  };

  const nextMedia = (e) => {
    e.stopPropagation(); 
    setCurrentIndex((prev) => (prev === selectedService.gallery.length - 1 ? 0 : prev + 1));
  };

  const prevMedia = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? selectedService.gallery.length - 1 : prev - 1));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="servicios" className="w-full max-w-6xl mx-auto px-6 py-20 overflow-hidden relative">
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-lake-dark mb-4">
          Nuestros Servicios ✨
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Descubre los tratamientos que tenemos para consentirte en nuestro estudio ubicado en Maipú.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {servicesList.map((service) => (
          <motion.div 
            key={service.id} 
            variants={cardVariants}
            layoutId={`tarjeta-${service.id}`} 
            onClick={() => handleOpenModal(service)}
            className="bg-lake-white rounded-3xl overflow-hidden shadow-soft hover:shadow-md hover:-translate-y-2 transition-transform duration-300 border-2 border-lake-pink flex flex-col cursor-pointer"
          >
            <div className="h-48 w-full overflow-hidden relative">
              <span className="absolute top-4 left-4 bg-lake-matcha text-lake-dark text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm">
                {service.category}
              </span>
              
              {service.isVideo ? (
                <video src={service.media} autoPlay loop muted playsInline className="w-full h-full object-cover pointer-events-none" />
              ) : (
                <img src={service.media} alt={service.title} className="w-full h-full object-cover" />
              )}
            </div>

            <div className="p-6 flex flex-col flex-grow items-center text-center">
              <h3 className="text-xl font-bold text-lake-dark mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm mb-6 flex-grow">
                {service.description}
              </p>
              
              <button className="text-lake-dark font-bold underline decoration-lake-pink decoration-4 underline-offset-4 hover:text-lake-pink transition-colors">
                Ver Detalles
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* MODAL CON CARRUSEL */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedService(null)} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer"
          >
            <motion.div
              layoutId={`tarjeta-${selectedService.id}`} 
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={(e) => e.stopPropagation()} 
              className="bg-lake-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl flex flex-col md:flex-row cursor-default relative"
            >
              
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 bg-lake-pink text-lake-dark w-10 h-10 rounded-full flex items-center justify-center font-bold z-20 hover:scale-110 transition-transform"
              >
                ✕
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-lake-dark group">
                
                {selectedService.gallery[currentIndex].type === "video" ? (
                  <video key={selectedService.gallery[currentIndex].src} src={selectedService.gallery[currentIndex].src} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                ) : (
                  <img key={selectedService.gallery[currentIndex].src} src={selectedService.gallery[currentIndex].src} alt={selectedService.title} className="w-full h-full object-cover" />
                )}

                {}
                {selectedService.gallery.length > 1 && (
                  <>
                    <button onClick={prevMedia} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-lake-dark w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-all opacity-0 group-hover:opacity-100">
                      ❮
                    </button>
                    <button onClick={nextMedia} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-lake-dark w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-all opacity-0 group-hover:opacity-100">
                      ❯
                    </button>

                    {/* Puntitos indicadores abajo */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {selectedService.gallery.map((_, i) => (
                        <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentIndex ? 'bg-lake-pink scale-125' : 'bg-white/50'}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <span className="bg-lake-matcha text-lake-dark text-xs font-bold px-3 py-1 rounded-full w-max mb-4">
                  {selectedService.category}
                </span>
                <h3 className="text-3xl md:text-4xl font-bold text-lake-dark mb-4 tracking-tight">
                  {selectedService.title}
                </h3>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed whitespace-pre-line">
                  {selectedService.detalleFull}
                </p>
                
                <a 
                  href="/agendar" 
                  className="w-full bg-lake-pink text-lake-dark font-bold text-lg py-4 rounded-full text-center shadow-sm hover:bg-lake-matcha hover:scale-[1.02] transition-all"
                >
                  Agendar este Servicio ✨
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
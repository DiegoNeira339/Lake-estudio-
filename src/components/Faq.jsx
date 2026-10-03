"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const preguntasFrecuentes = [
  {
    pregunta: "¿Con cuánto tiempo de anticipación debo agendar?",
    respuesta: "Te recomendamos agendar con al menos 1 o 2 semanas de anticipación para asegurar el día y la hora que mejor te acomoden."
  },
  {
    pregunta: "¿Cómo funciona el pago del abono o anticipo?",
    respuesta: "Para confirmar tu cita, solicitamos un abono previo que se coordina directamente por WhatsApp tras llenar el formulario de reserva. Este monto se descuenta del total del servicio."
  },
  {
    pregunta: "¿Dónde están ubicados exactamente?",
    respuesta: "Atendemos en nuestro Estudio Privado ubicado en Santiago. Una vez que confirmes tu cita y el abono, te enviaremos la dirección exacta y las indicaciones para llegar cómodamente."
  },
  {
    pregunta: "¿Cuáles son los métodos de pago aceptados?",
    respuesta: "Aceptamos transferencias bancarias y pago en efectivo el mismo día de tu atención en el estudio."
  }
];

export default function Faq() {
  const [abierto, setAbierto] = useState(null);

  const toggleFaq = (index) => {
    setAbierto(abierto === index ? null : index);
  };

  return (
    <section className="py-20 bg-gradient-section px-6 border-t border-lake-pink/20" id="faq">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-lake-dark mb-4 font-display">
            Preguntas Frecuentes 💬
          </h2>
          <p className="text-gray-600 text-lg">
            Resolvemos tus dudas más comunes antes de tu visita al estudio.
          </p>
        </div>

        <div className="space-y-4">
          {preguntasFrecuentes.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white border-2 border-lake-pink/30 rounded-2xl overflow-hidden shadow-sm hover:border-lake-pink/50 transition-all duration-300"
            >
              <button 
                onClick={() => toggleFaq(index)}
                className="w-full text-left px-6 py-5 font-bold text-lake-dark flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-lake-matcha focus-visible:ring-offset-2"
                aria-expanded={abierto === index}
              >
                <span className="text-lg pr-4">{faq.pregunta}</span>
                <motion.span
                  className="text-xl text-gray-400 transition-colors duration-300"
                  animate={{ rotate: abierto === index ? 180 : 0, color: abierto === index ? '#FFDFEA' : '#9CA3AF' }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  ▼
                </motion.span>
              </button>
              
              <AnimatePresence>
                {abierto === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="px-6 pb-5"
                  >
                    <p className="text-gray-600 leading-relaxed">{faq.respuesta}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
"use client";
import { useState } from "react";

// Aquí puedes editar, agregar o quitar preguntas fácilmente
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
    // Si haces clic en el que ya está abierto, se cierra. Si no, abre el nuevo.
    setAbierto(abierto === index ? null : index);
  };

  return (
    <section className="py-20 bg-lake-pink/10 px-6 border-t border-lake-pink/20" id="faq">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-lake-dark mb-4">
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
              className="bg-white border-2 border-lake-pink/30 rounded-2xl overflow-hidden transition-all duration-300 hover:border-lake-pink shadow-sm"
            >
              <button 
                onClick={() => toggleFaq(index)}
                className="w-full text-left px-6 py-5 font-bold text-lake-dark flex justify-between items-center focus:outline-none"
              >
                <span className="text-lg pr-4">{faq.pregunta}</span>
                <span 
                  className={`text-xl transition-transform duration-300 ${
                    abierto === index ? 'rotate-180 text-lake-pink' : 'text-gray-400'
                  }`}
                >
                  ▼
                </span>
              </button>
              
              {/* Contenedor de la respuesta con animación de altura */}
              <div 
                className={`px-6 overflow-hidden transition-all duration-500 ease-in-out ${
                  abierto === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-600">{faq.respuesta}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
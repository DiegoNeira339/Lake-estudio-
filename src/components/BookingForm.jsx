"use client";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

const horariosPorDia = {
  0: [], // Domingo cerrado
  1: ["10:30", "13:00", "15:00"], 
  2: ["10:30", "13:00", "15:00"], 
  3: ["10:30", "13:00", "15:00"],
  4: ["11:00", "14:00", "16:00", "18:00", "20:00"],
  5: ["14:00", "17:00", "20:00"], 
  6: ["14:00", "17:00", "20:00"],
};

export default function BookingForm() {
  const [formData, setFormData] = useState({ servicio: "", nombre: "", whatsapp: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [reservasOcupadas, setReservasOcupadas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState("");

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const response = await fetch('/api/reservas');
        const data = await response.json();
        
        if (response.ok && Array.isArray(data)) {
          setReservasOcupadas(data.map(res => res.fecha_hora));
        }
      } catch (error) {
        console.error("Error cargando reservas", error);
      }
    };
    cargarReservas();
  }, []);

  // Cálculo rápido y seguro del día seleccionado (usando mediodía para evitar saltos de zona horaria)
  const horasDelDiaSeleccionado = fechaSeleccionada 
    ? horariosPorDia[new Date(`${fechaSeleccionada}T12:00:00`).getDay()] 
    : [];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!fechaSeleccionada || !horaSeleccionada) {
      return Swal.fire({ title: 'Falta la hora', text: 'Elige un día y una hora disponible.', icon: 'warning', confirmButtonColor: '#e53e3e' });
    }
    if (!/^[+0-9\s]{8,15}$/.test(formData.whatsapp)) {
      return Swal.fire({ title: 'Número inválido', text: 'Ingresa un WhatsApp real.', icon: 'warning', confirmButtonColor: '#e53e3e' });
    }

    setIsLoading(true);
    const fechaHora = `${fechaSeleccionada}T${horaSeleccionada}`;
    const emailPayload = { ...formData, fechaHora: `${fechaSeleccionada} a las ${horaSeleccionada}` };

    try {
      // 1. Guardar en Supabase
      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, fechaHora }),
      });

      if (!response.ok) throw new Error("Fallo en el servidor");

      await Promise.all([
        emailjs.send('service_4mib3hr', 'template_9i057x4', emailPayload, '-NeKFisAL3qSyfkw4'),
        emailjs.send('service_4mib3hr', 'template_czd9ogi', emailPayload, '-NeKFisAL3qSyfkw4')
      ]).catch(err => console.error("Error EmailJS:", err));

      Swal.fire({ title: '¡Reserva Enviada!', text: `¡Listo ${formData.nombre}! Te contactarán pronto.`, icon: 'success', confirmButtonColor: '#2d3748' });

      setFormData({ servicio: "", nombre: "", whatsapp: "", email: "" });
      setFechaSeleccionada(""); setHoraSeleccionada("");
      setReservasOcupadas(prev => [...prev, fechaHora]);

    } catch (error) {
      Swal.fire({ title: 'Ups...', text: 'Hubo un problema. Intenta de nuevo.', icon: 'error', confirmButtonColor: '#e53e3e' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputsTexto = [
    { label: "Nombre completo", type: "text", name: "nombre", placeholder: "Ej: Camila Pérez", divClass: "" },
    { label: "WhatsApp", type: "tel", name: "whatsapp", placeholder: "+56 9 1234 5678", divClass: "" },
    { label: "Correo electrónico", type: "email", name: "email", placeholder: "tu@correo.com", divClass: "md:col-span-2" }
  ];

  return (
    <section id="agendar" className="w-full max-w-3xl mx-auto px-6 py-16">
      <div className="bg-lake-pink rounded-5xl p-8 md:p-12 shadow-soft border-4 border-lake-white">
        <h2 className="text-3xl md:text-4xl font-bold text-lake-dark text-center mb-8 tracking-tight">Reserva tu Hora 🗓️</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-lake-dark font-bold ml-2">¿Qué servicio buscas?</label>
            <select name="servicio" value={formData.servicio} onChange={handleChange} required className="p-4 rounded-2xl border-none outline-none focus:ring-4 focus:ring-lake-matcha bg-lake-white text-lake-dark font-medium cursor-pointer">
              <option value="">Selecciona una opción...</option>
              <optgroup label="Área Pelo"><option value="alisado">Alisado Profesional</option></optgroup>
              <optgroup label="Área Estética">
                <option value="limpieza">Limpieza Facial</option>
                <option value="cejas">Diseño de Cejas</option>
              </optgroup>
            </select>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-lake-dark font-bold ml-2">Elige el Día</label>
              <input type="date" min={new Date().toISOString().split("T")[0]} value={fechaSeleccionada} onChange={(e) => { setFechaSeleccionada(e.target.value); setHoraSeleccionada(""); }} required className="p-4 rounded-2xl border-none outline-none focus:ring-4 focus:ring-lake-matcha bg-lake-white text-lake-dark cursor-pointer"/>
            </div>

            {fechaSeleccionada && (
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-lake-dark font-bold ml-2">Elige la Hora</label>
                {horasDelDiaSeleccionado.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {horasDelDiaSeleccionado.map((hora) => {
                      const estaOcupada = reservasOcupadas.includes(`${fechaSeleccionada}T${hora}`);
                      return (
                        <button key={hora} type="button" disabled={estaOcupada} onClick={() => setHoraSeleccionada(hora)} className={`py-3 rounded-xl font-bold transition-all ${estaOcupada ? "bg-gray-200 text-gray-400 cursor-not-allowed line-through" : horaSeleccionada === hora ? "bg-lake-matcha text-lake-dark shadow-md scale-105" : "bg-lake-white text-lake-dark hover:bg-green-100"}`}>
                          {hora}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-red-50 text-red-500 font-bold p-4 rounded-2xl border-2 border-red-100 text-center shadow-sm">
                    Lo sentimos, este día el estudio se encuentra cerrado. 😴 <br/> Por favor, elige otro día en el calendario.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inputsTexto.map((inp, idx) => (
              <div key={idx} className={`flex flex-col gap-2 ${inp.divClass}`}>
                <label className="text-lake-dark font-bold ml-2">{inp.label}</label>
                <input type={inp.type} name={inp.name} value={formData[inp.name]} onChange={handleChange} placeholder={inp.placeholder} required className="p-4 rounded-2xl border-none outline-none focus:ring-4 focus:ring-lake-matcha bg-lake-white text-lake-dark" />
              </div>
            ))}
          </div>

          <button type="submit" disabled={isLoading} className={`mt-6 py-4 rounded-full font-bold text-lg shadow-sm transition-all ${isLoading ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-lake-matcha text-lake-dark hover:scale-[1.02] hover:shadow-md"}`}>
            {isLoading ? "Enviando reserva... ⏳" : "Confirmar Reserva"}
          </button>
        </form>
      </div>
    </section>
  );
}
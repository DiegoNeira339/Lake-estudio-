"use client";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

const horariosPorDia = {
  0: ["14:00", "16:00", "18:00"], // Domingo
  1: ["14:00", "16:00", "18:00", "20:00"], // Lunes
  2: ["14:00", "16:00", "18:00", "20:00"], // Martes
  3: ["14:00", "16:00", "18:00", "20:00"], // Miércoles
  4: ["11:00", "14:00", "16:00", "18:00", "20:00"], // Jueves
  5: ["14:00", "16:00", "18:00", "20:00"], // Viernes
  6: ["11:00", "14:00", "16:00", "18:00", "20:00"], // Sábado
};

export default function BookingForm() {
  const [formData, setFormData] = useState({
    servicio: "",
    nombre: "",
    whatsapp: "",
    email: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const [reservasOcupadas, setReservasOcupadas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState("");

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const response = await fetch('/api/reservas');
        if (response.ok) {
          const data = await response.json();
          setReservasOcupadas(data.map(res => res.fecha_hora));
        }
      } catch (error) {
        console.error("No se pudieron cargar las reservas", error);
      }
    };
    cargarReservas();
  }, []);

  let horasDelDiaSeleccionado = [];
  if (fechaSeleccionada) {
    const [year, month, day] = fechaSeleccionada.split('-');
    const fecha = new Date(year, month - 1, day);
    const numeroDeDia = fecha.getDay(); 
    
    horasDelDiaSeleccionado = horariosPorDia[numeroDeDia];
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!fechaSeleccionada || !horaSeleccionada) {
      Swal.fire({
        title: 'Falta la hora',
        text: 'Por favor, asegúrate de elegir un día y hacer clic en una hora disponible.',
        icon: 'warning',
        confirmButtonColor: '#e53e3e',
        confirmButtonText: 'Entendido'
      });
      return;
    }
   

    const whatsappRegex = /^[+0-9\s]{8,15}$/;
    if (!whatsappRegex.test(formData.whatsapp)) {
      Swal.fire({
        title: 'Número inválido',
        text: 'Por favor ingresa un número de WhatsApp real (mínimo 8 dígitos).',
        icon: 'warning',
        confirmButtonColor: '#e53e3e',
        confirmButtonText: 'Corregir'
      });
      return; 
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({
          ...formData,
          fechaHora: `${fechaSeleccionada}T${horaSeleccionada}`
        }),
      });

      if (response.ok) {
        
        try {
          await emailjs.send(
            'service_4mib3hr',
            'template_9i057x4',
            {
              nombre: formData.nombre,
              servicio: formData.servicio,
              fechaHora: `${fechaSeleccionada} a las ${horaSeleccionada}`,
              whatsapp: formData.whatsapp,
              email: formData.email
            },
            '-NeKFisAL3qSyfkw4'
          );
          console.log("¡Correo enviado al administrador con éxito!");
        } catch (error) {
          console.error("Falló el envío de correo:", error);
        }
       

        Swal.fire({
          title: '¡Reserva Enviada!',
          text: `¡Listo ${formData.nombre}! Tu reserva ha sido enviada al estudio. Te contactarán pronto.`,
          icon: 'success',
          confirmButtonColor: '#2d3748', 
          confirmButtonText: '¡Súper!'
        });
 
        setFormData({ servicio: "", nombre: "", whatsapp: "", email: "" });
        setFechaSeleccionada("");
        setHoraSeleccionada("");

        setReservasOcupadas(prev => [...prev, `${fechaSeleccionada}T${horaSeleccionada}`]);

      } else {
        throw new Error("El servidor falló al procesar la solicitud");
      }

    } catch (error) {
      console.error("Error al conectar con el backend:", error);
      
      Swal.fire({
        title: 'Ups...',
        text: 'Hubo un problema al enviar la reserva. Por favor intenta de nuevo.',
        icon: 'error',
        confirmButtonColor: '#e53e3e',
        confirmButtonText: 'Cerrar'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="agendar" className="w-full max-w-3xl mx-auto px-6 py-16">
      <div className="bg-lake-pink rounded-5xl p-8 md:p-12 shadow-soft border-4 border-lake-white">
        
        <h2 className="text-3xl md:text-4xl font-bold text-lake-dark text-center mb-8 tracking-tight">
          Reserva tu Hora 🗓️
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <label className="text-lake-dark font-bold ml-2">¿Qué servicio buscas?</label>
            <select 
              name="servicio"
              value={formData.servicio}
              onChange={handleChange}
              className="p-4 rounded-2xl border-none outline-none focus:ring-4 focus:ring-lake-matcha bg-lake-white text-lake-dark font-medium cursor-pointer"
              required
            >
              <option value="">Selecciona una opción...</option>
              <optgroup label="Área Pelo">
                <option value="alisado">Alisado Profesional</option>
              </optgroup>
              <optgroup label="Área Estética">
                <option value="limpieza">Limpieza Facial (con o sin extras)</option>
                <option value="cejas">Diseño de Cejas</option>
              </optgroup>
            </select>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-lake-dark font-bold ml-2">Elige el Día</label>
              <input 
                type="date" 
                min={new Date().toISOString().split("T")[0]} 
                value={fechaSeleccionada}
                onChange={(e) => {
                  setFechaSeleccionada(e.target.value);
                  setHoraSeleccionada(""); 
                }}
                className="p-4 rounded-2xl border-none outline-none focus:ring-4 focus:ring-lake-matcha bg-lake-white text-lake-dark cursor-pointer"
                required
              />
            </div>

            {fechaSeleccionada && (
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-lake-dark font-bold ml-2">Elige la Hora</label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {horasDelDiaSeleccionado.map((hora) => {
                    const fechaHoraActual = `${fechaSeleccionada}T${hora}`;
                    const estaOcupada = reservasOcupadas.includes(fechaHoraActual);

                    return (
                      <button
                        key={hora}
                        type="button"
                        disabled={estaOcupada}
                        onClick={() => setHoraSeleccionada(hora)}
                        className={`py-3 rounded-xl font-bold transition-all ${
                          estaOcupada 
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed line-through" 
                            : horaSeleccionada === hora 
                              ? "bg-lake-matcha text-lake-dark shadow-md scale-105" 
                              : "bg-lake-white text-lake-dark hover:bg-green-100" 
                        }`}
                      >
                        {hora}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-lake-dark font-bold ml-2">Nombre completo</label>
              <input 
                type="text" 
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Camila Pérez" 
                className="p-4 rounded-2xl border-none outline-none focus:ring-4 focus:ring-lake-matcha bg-lake-white text-lake-dark" 
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lake-dark font-bold ml-2">WhatsApp</label>
              <input 
                type="tel" 
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="+56 9 1234 5678" 
                className="p-4 rounded-2xl border-none outline-none focus:ring-4 focus:ring-lake-matcha bg-lake-white text-lake-dark" 
                required
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-lake-dark font-bold ml-2">Correo electrónico</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@correo.com" 
              className="p-4 rounded-2xl border-none outline-none focus:ring-4 focus:ring-lake-matcha bg-lake-white text-lake-dark" 
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`mt-6 py-4 rounded-full font-bold text-lg shadow-sm transition-all 
              ${isLoading 
                ? "bg-gray-400 text-gray-700 cursor-not-allowed" 
                : "bg-lake-matcha text-lake-dark hover:scale-[1.02] hover:shadow-md"
              }`}
          >
            {isLoading ? "Enviando reserva... ⏳" : "Confirmar Reserva"}
          </button>
          
        </form>
      </div>
    </section>
  );
}
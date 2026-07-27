"use client";
import { useState } from "react";
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    servicio: "",
    fechaHora: "",
    nombre: "",
    whatsapp: "",
    email: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    // ✨ EL NUEVO SEGURO CON ESTILO ✨
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

    const serviceID = "service_4mib3hr"; 
    const templateID = "template_9i057x4";
    const publicKey = "-NeKFisAL3qSyfkw4";

    const templateParams = {
      nombre: formData.nombre,
      servicio: formData.servicio,
      fechaHora: formData.fechaHora.replace("T", " a las "),
      whatsapp: formData.whatsapp,
      email: formData.email,
    };

    emailjs.send(serviceID, templateID, templateParams, publicKey)
      .then((response) => {
        console.log("¡Correo enviado con éxito!", response.status, response.text);
        
        Swal.fire({
          title: '¡Reserva Enviada!',
          text: `¡Listo ${formData.nombre}! Tu reserva ha sido enviada al estudio. Te contactarán pronto.`,
          icon: 'success',
          confirmButtonColor: '#2d3748', 
          confirmButtonText: '¡Súper!'
        });
        
        setFormData({ servicio: "", fechaHora: "", nombre: "", whatsapp: "", email: "" });
      })
      .catch((error) => {
        console.error("Error al enviar el correo:", error);
        
        Swal.fire({
          title: 'Ups...',
          text: 'Hubo un problema al enviar la reserva. Por favor intenta de nuevo.',
          icon: 'error',
          confirmButtonColor: '#e53e3e',
          confirmButtonText: 'Cerrar'
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
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

          <div className="flex flex-col gap-2">
            <label className="text-lake-dark font-bold ml-2">Fecha y Hora</label>
            <input 
              type="datetime-local" 
              name="fechaHora"
              value={formData.fechaHora}
              onChange={handleChange}
              className="p-4 rounded-2xl border-none outline-none focus:ring-4 focus:ring-lake-matcha bg-lake-white text-lake-dark font-medium cursor-pointer" 
              required
            />
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
            {isLoading ? "Enviando reserva... ⏳" : "Confirmar Reserva ✨"}
          </button>
          
        </form>
      </div>
    </section>
  );
}
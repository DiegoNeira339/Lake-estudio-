🌸 Lake Estudio — Plataforma Web & Sistema de Reservas MVP

Lake Estudio es una aplicación web full-stack diseñada para un estudio de estética local en Maipú, Chile. El proyecto combina una experiencia visual premium orientada al cliente (para el descubrimiento de servicios y reserva de citas) con un panel de administración privado para la gestión de contenidos, horarios y reservas.

El desarrollo se ejecutó con un enfoque Pragmatic Time-to-Market, priorizando valor de negocio, diseño responsive mobile-first y una arquitectura limpia sin sobre-ingeniería innecesaria.

🛠️ Tech Stack & Arquitectura

Frontend: Next.js (App Router, JavaScript .jsx), Tailwind CSS.

UI/UX & Animaciones: Framer Motion, Lucide Icons, Glassmorphism, Google Fonts (Playfair Display).

Backend & Base de Datos: Supabase (PostgreSQL, Storage buckets, Auth/Service Role).

Despliegue & Hosting: Vercel (CI/CD integrado a GitHub).

Asistencia de IA: Nemotron 3 (vía OpenCode CLI en VS Code) actuando como desarrollador autónomo bajo supervisión de arquitectura.

🚀 Características Principales

👁️ Experiencia de Cliente (Public Web)

Hero & Navegación Editorial: Interfaz estética con tipografía Playfair Display, gradientes suaves y efectos de cristal (glassmorphism).

Catálogo de Servicios: Tarjetas dinámicas con imágenes optimizadas vía next/image y modal informativo para cada tratamiento.

Galería de Trabajos: Grid responsivo con vista previa ampliada (lightbox) alimentada desde Supabase Storage.

Flujo de Agendamiento Dinámico: Formulario interactivo donde los horarios y días disponibles se consultan en tiempo real a la base de datos.

Preguntas Frecuentes (FAQ): Acordeón interactivo animado con Framer Motion.

🔐 Panel de Administración VIP (/michimiau)

Autenticación Simple: Control de acceso mediante contraseña secreta.

Módulo de Reservas (ReservasTable): Visualización y gestión de citas recibidas.

Gestión de Servicios (ServiciosManager): CRUD completo para añadir, editar o eliminar servicios y precios.

Gestión de Galería (GaleriaManager): Carga y administración de fotografías en Supabase Storage.

Control de Horarios (HorariosManager): Configuración dinámica de días operativos y bloques horarios disponibles para agendamiento.

📂 Estructura del Proyecto

lake-estudio/
├── public/
│   └── favicon.ico / icon.png
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── galeria/route.js
│   │   │   ├── horarios/route.js
│   │   │   ├── reservas/route.js
│   │   │   └── servicios/route.js
│   │   ├── agendar/
│   │   ├── michimiau/          # Panel Admin
│   │   ├── layout.js
│   │   ├── page.js             # Landing Page (Hero)
│   │   └── globals.css         # Design tokens, animaciones y glassmorphism
│   ├── components/
│   │   ├── admin/              # Componentes modulares del Dashboard
│   │   │   ├── AdminTabs.jsx
│   │   │   ├── GaleriaManager.jsx
│   │   │   ├── HorariosManager.jsx
│   │   │   ├── ReservasTable.jsx
│   │   │   ├── ServiciosManager.jsx
│   │   │   └── StatCard.jsx
│   │   ├── BookingForm.jsx
│   │   ├── Faq.jsx
│   │   ├── Footer.jsx
│   │   ├── GaleriaTrabajos.jsx
│   │   ├── Header.jsx
│   │   └── Services.jsx
│   └── lib/
│       └── supabase/
│           ├── client.js       # Cliente Supabase Browser
│           └── server.js       # Cliente Supabase Server (API Routes)
├── next.config.mjs
├── package.json
└── tailwind.config.js


🗄️ Esquema de Base de Datos (Supabase)

Tabla: servicios

id (int8, PK)

titulo (text)

descripcion (text)

precio (numeric / text)

foto_url (text)

created_at (timestamp)

Tabla: galeria

id (int8, PK)

titulo (text)

foto_url (text)

created_at (timestamp)

Tabla: reservas

id (int8, PK)

nombre_cliente (text)

telefono (text)

servicio_id (int8, FK -> servicios.id)

fecha (date)

hora (text)

estado (text)

Tabla: horarios

id (int8, PK)

dia_semana (int2) — 0 (Dom) a 6 (Sáb)

hora_inicio (time)

hora_fin (time)

activo (boolean)

🔒 Parche de Seguridad RLS (Row Level Security)

Para asegurar la base de datos manteniendo la compatibilidad con el frontend público y las API routes backend, se aplican las siguientes políticas en el SQL Editor de Supabase:

-- Habilitar RLS en todas las tablas
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeria ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

-- Lectura pública (Permite a cualquier cliente consultar datos)
CREATE POLICY "Lectura publica de servicios" ON servicios FOR SELECT USING (true);
CREATE POLICY "Lectura publica de galeria" ON galeria FOR SELECT USING (true);
CREATE POLICY "Lectura publica de horarios" ON horarios FOR SELECT USING (true);

-- Inserción de reservas (Permite a las clientas agendar citas)
CREATE POLICY "Permitir crear reservas" ON reservas FOR INSERT WITH CHECK (true);


🔄 Flujo de Trabajo Local & Git

Levantar Servidor de Desarrollo

npm run dev


Probar Compilación de Producción

npm run build


Control de Versiones & Despliegue

git add .
git commit -m "feat: [descripción de la mejora]"
git push origin main


(Vercel desplegará automáticamente los cambios tras recibir el push).

🎯 Próximos Pasos & Roadmap (Post-MVP)

[ ] Configuración e integración con Google My Business + Google Maps.

[ ] Integración de botones pre-llenados de WhatsApp (wa.me) para confirmaciones rápidas.

[ ] Configuración del Apple Touch Icon y PWA Manifest para instalación en dispositivos móviles.

[ ] Monitoreo de uso inicial antes de agregar nuevas funcionalidades complejas.

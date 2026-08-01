export default function Footer() {
  return (
    <footer className="w-full bg-lake-lilac/20 border-t border-lake-lilac/40 py-10 px-6 mt-auto">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left text-lake-dark">

      
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-2xl font-extrabold tracking-tight">Lake Estudio 🌸</span>
          <p className="opacity-80 text-sm mt-2 max-w-xs">
            Recuerda que tu cita se confirma definitivamente tras el pago del anticipo coordinado por WhatsApp.
          </p>
        </div>


        <div className="flex flex-col items-center md:items-start gap-2">
          <h4 className="font-bold text-lg mb-2">Contacto</h4>
          <a 
            href="https://www.instagram.com/lakestudio.cl?igsh=cmNmOXNvaDk3eHlv" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="opacity-80 hover:font-bold hover:scale-105 transition-all"
          >
            Instagram 
          </a>
          <a 
            href="https://wa.me/56912345678" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="opacity-80 hover:font-bold hover:scale-105 transition-all"
          >
            WhatsApp General
          </a>
        </div>

        <div className="flex flex-col items-center md:items-start gap-2">
          <h4 className="font-bold text-lg mb-2">Ubicación</h4>
          <p className="opacity-80 text-sm">
            Estudio Privado<br/>
            Santiago, Chile
          </p>
        </div>

      </div>

      <div className="text-center text-sm opacity-60 mt-12">
        © {new Date().getFullYear()} Lake Estudio. Todos los derechos reservados.
      </div>
    </footer>
  );
}
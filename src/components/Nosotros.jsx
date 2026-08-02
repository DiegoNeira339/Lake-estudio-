import Image from "next/image";

export default function Nosotros() {
  return (
    <section id="nosotros" className="py-20 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-12 bg-white/40 p-8 md:p-12 rounded-3xl shadow-sm border border-white/60">
        
        {/* Imagen ilustrativa (Puedes cambiar el src por una foto real del local después) */}
        <div className="w-full md:w-1/2 relative h-[350px] rounded-2xl overflow-hidden shadow-md border-4 border-white">
          <Image 
            src="/logo_lake.jpeg" 
            alt="Conoce Lake Estudio"
            fill
            className="object-cover"
          />
        </div>
        
        {/* Texto del estudio */}
        <div className="w-full md:w-1/2 text-lake-dark">
          <h2 className="text-4xl font-extrabold mb-6 tracking-tight">Acerca de Nosotros</h2>
          <p className="text-lg mb-4 leading-relaxed font-medium text-gray-700">
            En <strong className="text-lake-dark">Lake Estudio</strong>, nuestra pasión es realzar tu belleza natural. Somos especialistas dedicadas a ofrecerte una experiencia única en estética integral y cuidado personal.
          </p>
          <p className="text-lg leading-relaxed font-medium text-gray-700">
            Cada detalle de nuestro espacio está pensado para que te relajes, desconectes de la rutina y disfrutes de un momento exclusivo para ti. Trabajamos con los mejores productos y técnicas para garantizar que los resultados superen tus expectativas.
          </p>
        </div>

      </div>
    </section>
  );
}
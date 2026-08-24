import Nosotros from "../../components/Nosotros";

export const metadata = {
  title: "Nosotros | Lake Estudio",
  description: "Conoce más sobre nuestro estudio de belleza",
};

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-lake-white font-sans pt-12 md:pt-24 pb-12">
      <Nosotros />
    </main>
  );
}
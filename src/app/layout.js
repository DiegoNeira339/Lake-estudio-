import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer"; 
import { Analytics } from "@vercel/analytics/react"; 
import FloatingInstagram from "../components/FloatingInstagram"; // ✨ IMPORTAMOS EL BOTÓN ✨

export const metadata = {
  title: "Lake Estudio",
  description: "Centro de Belleza y Estética",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="antialiased bg-lake-pink min-h-screen flex flex-col">
        
        <Header />
        
        <div className="flex-grow">
          {children}
        </div>

        <Footer />
        
        <FloatingInstagram /> 
        
        <Analytics /> 
        
      </body>
    </html>
  );
}
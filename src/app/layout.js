import { Geist } from "next/font/google";
import DemoModal from "../components/DemoModal";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata = {
  title: "CDC Descomplica - Navegue pelo Código de Defesa do Consumidor",
  description:
    "Ferramenta de busca intuitiva para o Código de Defesa do Consumidor. Encontre artigos e informações relevantes de forma rápida e simples.",
  keywords: [
    "CDC",
    "Código de Defesa do Consumidor",
    "direito do consumidor",
    "legislação",
    "busca",
    "artigos",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${geist.variable}`}>
      <body className="min-h-screen bg-white antialiased">


        {/* Main content */}
        <div className="scroll-smooth">{children}</div>

        {/* Add blue gradient overlay at the bottom of every page */}
        <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-50/50 to-transparent pointer-events-none" />
      </body>
    </html>
  );
}

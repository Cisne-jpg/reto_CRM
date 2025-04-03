"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import NavBar from "./NavBar";
import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Estado para la sidebar
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  // Listas de rutas donde se oculta cada componente
  const hideNavBarRoutes = ["/login", "/"];
  const hideHeaderRoutes = ["/login"];
  const hideFooterRoutes = ["/login"];

  // Verificamos si debemos mostrar cada componente
  const showNavBar = !hideNavBarRoutes.includes(pathname);
  const showHeader = !hideHeaderRoutes.includes(pathname);
  const showFooter = !hideFooterRoutes.includes(pathname);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Si showNavBar es true y isOpen es true, mostramos NavBar */}
      {showNavBar && isOpen && <NavBar />}

      <div className="flex-1 flex flex-col">
        {/* Header */}
        {showHeader && <Header onToggleSidebar={toggleSidebar} />}

        {/* Contenido principal */}
        <main className="flex-1 p-4 text-black">{children}</main>

        {/* Footer */}
        {showFooter && <Footer />}
      </div>
    </div>
  );
}
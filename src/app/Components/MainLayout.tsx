// app/(components)/MainLayout.tsx
"use client"; // Aquí sí usamos client

import { useState } from "react";
import NavBar from "./NavBar";
import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Navbar se muestra si isOpen es true */}
      {isOpen && <NavBar />}

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 text-black">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

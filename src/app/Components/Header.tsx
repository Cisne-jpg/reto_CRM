'use client';

import { useState, useEffect } from "react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const [ownerName, setOwnerName] = useState<string | null>(null);

  useEffect(() => {
    // Leer el nombre almacenado tras el login
    const storedName = localStorage.getItem("ownerName");
    if (storedName) {
      setOwnerName(storedName);
    }
  }, []);

  // Inicial para el avatar (fallback 'U')
  const initial = ownerName ? ownerName.charAt(0).toUpperCase() : 'U';

  return (
    <header className="h-16 bg-white flex items-center px-4 shadow text-black">
      {/* Botón hamburguesa */}
      <button
        className="mr-4 text-gray-700 hover:text-gray-900"
        onClick={onToggleSidebar}
      >
        &#9776;
      </button>

      {/* Logo o Título */}
      <h1 className="font-bold text-lg mr-4">DEALTRACK CRM</h1>

      {/* Imagen */}
      <img
        src="https://i.ibb.co/svQ1DTHd/IMG-4795.png"
        alt="Logo"
        className="h-10 w-10 rounded-full object-cover mr-4"
      />

      {/* Bloque de bienvenida y avatar */}
      <div className="ml-auto flex items-center space-x-4">
        {ownerName && (
          <p className="text-gray-700">
            Bienvenido/a, <span className="font-semibold">{ownerName}</span>!
          </p>
        )}
        <div className="bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center text-white">
          {initial}
        </div>
      </div>
    </header>
  );
}

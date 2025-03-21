"use client";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
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

      {/* Barra de búsqueda centrada */}
      <input
        type="text"
        placeholder="Buscar..."
        className="border border-gray-300 rounded px-2 py-1 text-black flex-grow max-w-md"
      />

      {/* Ícono de usuario alineado a la derecha */}
      <div className="bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center text-white ml-auto">
        U
      </div>
    </header>
  );
}

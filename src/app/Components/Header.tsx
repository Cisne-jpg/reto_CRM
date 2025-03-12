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
      <h1 className="font-bold text-lg mr-auto">DEALTRACK CRM</h1>

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar..."
        className="border border-gray-300 rounded px-2 py-1 text-black mr-4"
      />

      {/* Ícono de usuario */}
      <div className="bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center text-white">
        U
      </div>
    </header>
  );
}

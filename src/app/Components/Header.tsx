// Header.tsx
'use client';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  ownerName: string | null;
}

export default function Header({ onToggleSidebar, isSidebarOpen, ownerName }: HeaderProps) {
  const initial = ownerName?.charAt(0).toUpperCase() || '';

  return (
    <header className="sticky top-0 z-50 flex items-center h-16 bg-white px-4 shadow-md">
      {/* Botón abrir/cerrar */}
      <button
        onClick={onToggleSidebar}
        className="z-50 p-2 mr-4 rounded-lg hover:bg-gray-100 focus:outline-none transition-transform duration-300 ease-in-out"
      >
        {isSidebarOpen ? (
          // Icono X
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Icono hamburguesa
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Logo / Título fijo a la izquierda */}
      <h1 className="text-xl font-semibold">DEALTRACK CRM</h1>

      {/* Empuja lo siguiente a la derecha */}
      <div className="ml-auto flex items-center space-x-3">
        {ownerName && <span className="text-gray-700">{ownerName}</span>}
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
          {initial}
        </div>
      </div>
    </header>
);
}

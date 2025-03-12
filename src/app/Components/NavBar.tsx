"use client";

import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-64 bg-white p-4 border-r border-gray-300 text-black">
      <ul className="flex flex-col gap-4">
        <li>
          <Link href="/" className="hover:text-blue-600">
            Inicio
          </Link>
        </li>
        <li>
          <Link href="/clientes" className="hover:text-blue-600">
            Clientes
          </Link>
        </li>
        <li>
          <Link href="/graficas" className="hover:text-blue-600">
            Gráficas
          </Link>
        </li>
        <li>
          <Link href="/chats" className="hover:text-blue-600">
            Chats
          </Link>
        </li>
        <li>
          <Link href="/negocios" className="hover:text-blue-600">
            Negocios
          </Link>
        </li>
        <li>
          <Link href="/ajustes" className="hover:text-blue-600">
            Ajustes
          </Link>
        </li>
      </ul>
    </nav>
  );
}

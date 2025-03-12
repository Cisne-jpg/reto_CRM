"use client";

export default function Footer() {
  return (
    <footer className="h-12 bg-white flex items-center justify-center shadow text-black">
      <p className="text-sm">
        © {new Date().getFullYear()} DealTrack CRM. Todos los derechos reservados.
      </p>
    </footer>
  );
}

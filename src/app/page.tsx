import React from 'react';
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-white text-black">
      
      <section className="bg-gray-300 text-center  w-full min-h-py-16 flex flex-col items-center justify-center">      <div className="bg-white border-black border-4 rounded-full w-64 h-32 flex items-center justify-center">
  <p className="text-sm flex font-bold items-center space-x-4">
    DealTrack CRM
    <img
      src="https://i.ibb.co/svQ1DTHd/IMG-4795.png"
      alt="Logo"
      className="h-10 w-10 rounded-full object-cover"
    />
  </p>
</div>

</section>


      <section className="p-8 bg-white">
        <h3 className="text-lg font-bold">¿Qué es Dealtrack?</h3>
        <p className="text-gray-600 mt-2">
        Dealtrack CRM es una empresa de tecnología enfocada en transformar la manera en la que las empresas gestionan sus relaciones con clientes y procesos comerciales.

        Dealtrack CRM es un software de gestión comercial con enfoque kanban, diseñado para simplificar la forma en que gestionas tus ventas, clientes y oportunidades.

        Ideal para equipos de ventas, emprendedores, pymes y cualquier empresa que quiera tener control total de su pipeline, sin complicaciones.

        </p>

        <h3 className="text-lg font-bold mt-6">Objetivos</h3>
        <div className="grid grid-cols-2 gap-4 mt-4">
        <p>- Impulsar el crecimiento de tu negocio ayudándote a convertir más prospectos en clientes.</p>
        
        <p>-Simplificar tu gestión comercial con una interfaz visual, fácil de usar y basada en procesos.</p>
        
        <p>-Mejorar la colaboración interna para que todo tu equipo esté alineado, sin perder tiempo en hojas de cálculo o correos interminables.</p>
        
        <p>-Ofrecer datos claros y accionables, con reportes y métricas en tiempo real para tomar decisiones más inteligentes.</p>

        </div>
      </section>

      <section className="p-8 bg-gray-100">
  <div className="bg-gray-200 p-6 text-center rounded-md mb-4">
    <h3 className="text-lg font-bold">¿Quieres unirte? // ¿Ya eres parte de nosotros?</h3>
    <div className="flex justify-center gap-4 mt-2">
      <button className="bg-gray-300 text-white px-4 py-2 rounded">
        <Link href="/Signup" className="text-black hover:underline justify-right">
        Crea tu cuenta
    </Link>
    </button>
      <button className="bg-gray-300 text-white px-4 py-2 rounded">
      <Link href="/Login" className="text-black hover:underline justify-right">
        Inicia sesion
    </Link>
        </button>
    </div>
  </div>
</section>
    </div>
  );
}

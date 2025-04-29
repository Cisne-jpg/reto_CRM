import React from 'react';
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-[var(--font-geist-sans)]">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-2 w-48 h-48 mx-auto flex items-center justify-center transform hover:scale-105 transition-all duration-300">
              <Image
                src="https://i.ibb.co/svQ1DTHd/IMG-4795.png"
                width={1920}
                height={1080}
                alt="Logo"
                className="h-24 w-24 object-contain animate-float"
              />
            </div>
            <h1 className="text-4xl font-bold mt-8 mb-4">DealTrack CRM</h1>
            <p className="text-italic text-xl">TRANSFORMANDO LA GESTIÓN COMERCIAL MODERNA</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 relative pl-4 border-l-4 border-blue-600">
              ¿Qué es Dealtrack?
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Dealtrack CRM es una solución tecnológica innovadora diseñada para revolucionar la gestión 
              de relaciones comerciales. Nuestra plataforma combina la metodología Kanban con herramientas 
              avanzadas de CRM, ofreciendo una experiencia intuitiva para equipos de ventas, emprendedores 
              y empresas que buscan optimizar su pipeline comercial.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Nuestra Misión</h3>
              <p className="text-gray-600">
                Simplificar la gestión comercial mediante interfaces intuitivas y procesos inteligentes, 
                permitiendo a las empresas enfocarse en lo que realmente importa: construir relaciones duraderas.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Nuestra Visión</h3>
              <p className="text-gray-600">
                Ser el partner tecnológico líder en transformación digital para equipos comerciales en 
                Latinoamérica, impulsando la eficiencia operativa y el crecimiento sostenible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Nuestros Objetivos</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {icon: '🚀', text: 'Impulsar el crecimiento mediante conversión efectiva de prospectos'},
              {icon: '🎯', text: 'Simplificar gestión comercial con interfaz visual intuitiva'},
              {icon: '🤝', text: 'Mejorar colaboración interna y alineación de equipos'},
              {icon: '📊', text: 'Proveer datos accionables y métricas en tiempo real'}
            ].map((item, index) => (
              <div key={index} className="flex items-start p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <span className="text-2xl mr-4">{item.icon}</span>
                <p className="text-gray-600 flex-1">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto bg-blue-600 p-12 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-6">Únete a la revolución comercial</h3>
            <p className="text-blue-100 mb-8">Comienza a transformar tu gestión comercial hoy mismo</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/Signup" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-sm">
                Crear cuenta gratuita
              </Link>
              <Link href="/Login" className="text-white px-8 py-3 rounded-lg font-semibold border-2 border-white hover:bg-white/10 transition-colors">
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setErrors({});
    setErrorMessage("");

    const { email, password } = formData;
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "El correo electrónico no es válido.";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Detectar si estamos en localhost
      const isLocal = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1');
      
      // Configurar la URL base
      const API_BASE_URL = isLocal 
        ? 'http://localhost:3000'  // Backend local
        : process.env.NEXT_PUBLIC_API_URL;  // Producción

      const response = await fetch(`${API_BASE_URL}/owners/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Error al iniciar sesión.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      setErrorMessage("Ocurrió un error inesperado. Por favor, inténtalo de nuevo.");
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-center">
          <div className="animate-float">
            <img
              src="https://i.ibb.co/svQ1DTHd/IMG-4795.png"
              alt="DealTrack CRM"
              className="h-16 w-16 mx-auto object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-white mt-4">Bienvenido de vuelta</h2>
          <p className="text-blue-100 mt-2">Ingresa a tu cuenta Dealtrack CRM</p>
        </div>

        <div className="px-8 py-10">
          {success && (
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>¡Acceso concedido! Redirigiendo...</span>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <Input
                label="Correo electrónico"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
              
              <Input
                label="Contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-0.5 focus:ring-4 focus:ring-blue-200"
            >
              Acceder a la plataforma
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

interface InputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
}

function Input({ label, name, type = "text", value, onChange, error, icon }: InputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 ${icon ? 'pl-10' : 'pl-4'} pr-4 border ${
            error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } rounded-lg focus:ring-2 transition-all placeholder-gray-400`}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
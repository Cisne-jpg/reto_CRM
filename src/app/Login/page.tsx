'use client';
import Image from "next/image";
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
    const validationErrors: { [key: string]: string } = {};

    if (!email) validationErrors.email = "El correo es obligatorio.";
    else if (!/\S+@\S+\.\S+/.test(email)) validationErrors.email = "Correo inválido.";
    
    if (!password) validationErrors.password = "La contraseña es obligatoria.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

      const res = await fetch(`${API_BASE_URL}/owners/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || 'Error de autenticación');
        return;
      }

      // Guardar datos
      localStorage.setItem('ownerId', data.user.OwnerID.toString());
      localStorage.setItem('ownerName', data.user.name);
      localStorage.setItem('authToken', data.token);

      setSuccess(true);
      setTimeout(() => router.push('/Dashboard'), 1000);

    } catch (err) {
      console.error('Error login:', err);
      setErrorMessage('Error de conexión');
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Cabecera con gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-center">
          <div className="animate-float">
            <Image
              src="https://i.ibb.co/svQ1DTHd/IMG-4795.png"
              width={120}
              height={40}
              alt="Logo CRM"
              className="h-16 w-16 mx-auto object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-white mt-4">Bienvenido</h2>
          <p className="text-blue-100 mt-2">Ingresa a tu cuenta</p>
        </div>

        {/* Cuerpo del formulario */}
        <div className="px-8 py-10">
          {/* Mensajes de estado */}
          {success && (
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              ¡Redirigiendo...
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              {errorMessage}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              {/* Campo Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    } rounded-lg focus:ring-2 focus:ring-blue-200 transition-all`}
                    placeholder="ejemplo@correo.com"
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Campo Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    } rounded-lg focus:ring-2 focus:ring-blue-200 transition-all`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
              </div>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
            >
              Acceder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
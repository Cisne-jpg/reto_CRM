'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const newErrors: any = {};
    const { firstName, lastName, email, password, birthDate } = formData;

    if (!firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
    if (!lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
    if (!email.includes('@')) newErrors.email = 'Correo inválido';
    if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres';

    const birthYear = new Date(birthDate).getFullYear();
    if (!birthDate || birthYear < 1910 || birthYear > new Date().getFullYear()) {
      newErrors.birthDate = 'Fecha inválida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const isLocal = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1');
      
      const API_BASE_URL = isLocal 
        ? 'http://localhost:3000' 
        : process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${API_BASE_URL}/owners/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: `${formData.firstName} ${formData.lastName}`,
          dob: formData.birthDate,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setErrorMessage(data.message || 'Error en el registro');
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
      
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error de conexión con el servidor');
    }
  };

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
          <h2 className="text-2xl font-bold text-white mt-4">Crea tu cuenta</h2>
          <p className="text-blue-100 mt-2">Únete a la plataforma Dealtrack CRM</p>
        </div>

        <div className="px-8 py-10">
          {success && (
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              ¡Registro exitoso! Redirigiendo...
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                }
              />
              
              <Input
                label="Apellido"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                }
              />
            </div>

            <Input
              label="Correo electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              }
            />

            <Input
              label="Fecha de Nacimiento"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              error={errors.birthDate}
              icon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              }
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-0.5 focus:ring-4 focus:ring-blue-200"
            >
              Crear cuenta
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Inicia sesión
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, type = 'text', value, onChange, error, icon }: any) {
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
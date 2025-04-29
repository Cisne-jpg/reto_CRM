'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Type Definitions
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  birthDate?: string;
}

interface InputProps {
  label: string;
  name: keyof FormData;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
}

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
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
      const isLocal =
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1');

      const API_BASE_URL = isLocal
        ? 'http://localhost:3000'
        : process.env.NEXT_PUBLIC_API_URL || '';

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
      setErrorMessage('');
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error de conexión con el servidor');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
        <div className="space-y-4">
          <Input
            label="Nombre"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
          <Input
            label="Apellido"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
          <Input
            label="Correo electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          <Input
            label="Fecha de nacimiento"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
            error={errors.birthDate}
          />
        </div>

        {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
        {success && <p className="text-green-600 mt-4">¡Registro exitoso!</p>}

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

function Input({ label, name, type = 'text', value, onChange, error, icon }: InputProps) {
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
          className={`w-full px-4 py-3 ${
            icon ? 'pl-10' : 'pl-4'
          } pr-4 border ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } rounded-lg focus:ring-2 transition-all placeholder-gray-400`}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}

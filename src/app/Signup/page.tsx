'use client';

import Image from 'next/image';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

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
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const { firstName, lastName, email, password, birthDate } = formData;
    if (!firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
    if (!lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
    if (email && !email.includes('@')) newErrors.email = 'Correo inválido';
    if (password && password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    if (birthDate) {
      const year = new Date(birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      if (year < 1910 || year > currentYear) newErrors.birthDate = 'Fecha inválida';
    } else {
      newErrors.birthDate = 'Fecha inválida';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const res = await fetch('https://api-crm-livid.vercel.app/owners/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: `${formData.firstName} ${formData.lastName}`,
          dob: formData.birthDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message ?? 'Error en el registro');
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push('/Login'), 2000);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error de conexión';
      setErrorMessage(msg);
    }
  };

  const fields: Array<keyof FormData> = ['firstName', 'lastName', 'email', 'password', 'birthDate'];
  const getType = (field: keyof FormData): string =>
    field === 'email' ? 'email' : field === 'password' ? 'password' : field === 'birthDate' ? 'date' : 'text';
  const getLabel = (field: keyof FormData): string =>
    field === 'firstName' ? 'Nombre' : field === 'lastName' ? 'Apellido' : field === 'email' ? 'Correo electrónico' : field === 'password' ? 'Contraseña' : 'Fecha de nacimiento';

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-blue-200">
        <div className="flex justify-center mb-6">
          <Image
            src="https://i.ibb.co/svQ1DTHd/IMG-4795.png"
            alt="Logo DealTrack CRM"
            width={100}
            height={100}
          />
        </div>
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">Crear cuenta</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-blue-700 mb-1">{getLabel(field)}</label>
              <input
                type={getType(field)}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                  errors[field] ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
            </div>
          ))}
          {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}
          {success && <p className="text-green-600 text-center">¡Registro exitoso!</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Registrarse
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            onClick={() => router.push('/Login')}
            className="text-blue-600 hover:underline"
          >
            ¿Ya tienes cuenta? Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

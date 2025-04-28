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

  // Validación del formulario
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

  // Manejo de cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Enviar el formulario al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Formulario válido:', formData);

      try {
        const response = await fetch('http://localhost:4000/owners/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.firstName + ' ' + formData.lastName,  // Concatenando el nombre y apellido
            dob: formData.birthDate,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          // Redirigir a login después de un registro exitoso
          router.push('/login');
        } else {
          // Mostrar mensaje de error si ocurre un problema
          alert(data.message || 'Error en el registro');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al intentar registrarse');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Registro</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nombre" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
          <Input label="Apellido" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} />
          <Input label="Correo" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
          <Input label="Contraseña" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} />
          <Input label="Fecha de Nacimiento" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} error={errors.birthDate} />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

function Input({ label, name, type = 'text', value, onChange, error }: any) {
  return (
    <div>
      <label className="block text-gray-700">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false); // Para mostrar mensaje de éxito
  const [errorMessage, setErrorMessage] = useState(''); // Mensaje de error de login

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.includes("@")) {
      newErrors.email = "Correo inválido";
    }
    if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setErrorMessage("");
  
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:3000/owners/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
  
        const data = await response.json();
        console.log("Respuesta API:", data); // Ver estructura aquí
  
        if (!response.ok) {
          setErrorMessage(data.message || "Credenciales incorrectas");
          return;
        }
  
        // Modificación clave aquí ▼ (depende de la estructura real)
        const ownerId = data.user?.OwnerID;

        
        console.log("OwnerID extraído:", ownerId); // Ver si llega
  
        if (ownerId) {
          localStorage.setItem("ownerId", ownerId.toString());
          setSuccess(true);
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        } else {
          console.error("OwnerID no encontrado en:", data);
          setErrorMessage("Error del servidor: ID no recibido");
        }
      } catch (error) {
        setErrorMessage("Error en la conexión con el servidor");
      }
    }
  };
  
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Iniciar Sesión</h2>

        {success && (
          <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-center">
            ¡Inicio de sesión exitoso! Redirigiendo...
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 text-red-800 p-3 rounded mb-4 text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Correo"
            name="email"
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
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Ingresar
          </button>
        </form>
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
}

function Input({ label, name, type = "text", value, onChange, error }: InputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`mt-1 w-full p-2 border rounded-lg ${
          error ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-blue-400`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
'use client';

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface Profile {
  OwnerID: number;
  Name: string;
  Email: string;
  DOB: string | null;
  ProfilePhoto: string | null;
  Descrip: string | null;
}

const tags = [
  "Mecanica", "Automotriz", "Herramientas", "Reparaciones",
  "Motores", "Diagnostico", "Mantenimiento", "Afinacion"
];

export default function ProfileDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("ownerId");
    localStorage.removeItem("ownerName");
    localStorage.removeItem("authToken");
+   // Avisamos al header que hubo logout
+   window.dispatchEvent(new Event("logout"));
    router.push("/");
-   router.refresh();
  };

  // URL base dinámica
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://api-crm-livid.vercel.app");

  useEffect(() => {
    const ownerId = localStorage.getItem("ownerId");
    if (!ownerId) {
      setError("Usuario no autenticado");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/profile/${ownerId}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: Profile = await res.json();
        setProfile(data);
      } catch (err: any) {
        console.error("Fetch profile error:", err);
        setError("No se pudo cargar el perfil");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [API_BASE_URL]);

  if (loading) return <p className="p-4">Cargando perfil...</p>;
  if (error || !profile) return <p className="p-4 text-red-500">{error || "Perfil no encontrado"}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full border bg-gray-100 overflow-hidden">
            {profile.ProfilePhoto ? (
              <img
                src={profile.ProfilePhoto}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="flex items-center justify-center h-full text-gray-500">?</span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{profile.Name}</h2>
            <p className="text-gray-500">{profile.Email}</p>
            <p className="text-gray-600 mt-1">
              {profile.Descrip || "Agrega una descripción a tu perfil."}
            </p>
          </div>
        </div>
        {/* Botón de Cerrar sesión con nuevos estilos */}
        <button
          onClick={handleLogout}
          className="
            bg-red-500 
            text-black 
            px-4 py-2 
            rounded 
            hover:cursor-pointer 
            transition-colors 
            duration-150
          "
        >
          Cerrar sesión
        </button>
      </div>

      <Card className="bg-blue-100 mt-4 p-4 h-52 flex items-center justify-center text-gray-600">
        Placeholder Gráfica
      </Card>

      <Card className="bg-blue-100 mt-4 p-4">
        <h3 className="text-lg font-semibold">Etiquetas identificadoras</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map(tag => (
            <span key={tag} className="bg-white px-3 py-1 rounded-lg shadow-sm text-sm">
              {tag}
            </span>
          ))}
        </div>
      </Card>

      <Card className="mt-4 p-4">
        <h3 className="text-lg font-semibold">Publicaciones</h3>
        <p className="text-gray-600">Descripción</p>
      </Card>
    </div>
  );
}

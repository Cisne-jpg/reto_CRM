'use client';
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

// Tipado
interface Profile {
  OwnerID: number;
  Name: string;
  Email: string;
  DOB: string | null;
  ProfilePhoto: string | null;
  Descrip: string | null;
  Tags: string[];
}

// Función auxiliar movida fuera del componente
const fetchJson = async (
  path: string,
  opts?: RequestInit,
  localApiUrl = "",
  hostedApiUrl = ""
): Promise<Profile> => {
  const tryLocal = localApiUrl
    ? fetch(`${localApiUrl}${path}`, opts).catch(() => null)
    : Promise.resolve(null);

  const resLocal = await tryLocal;
  const res = resLocal && resLocal.ok
    ? resLocal
    : await fetch(`${hostedApiUrl}${path}`, opts);

  if (!res.ok) throw new Error(`Error ${res.status}`);
  const json = await res.json();
  const data = json.data;

  if (data.Etiquetas) {
    data.Tags = data.Etiquetas;
    delete data.Etiquetas;
  }

  return data as Profile;
};

export default function ProfileDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newDescription, setNewDescription] = useState<string>("");
  const [descError, setDescError] = useState<string | null>(null);
  const [userTags, setUserTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [tagError, setTagError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const LOCAL_API_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL || "";
  const HOSTED_API_URL = process.env.NEXT_PUBLIC_API_URL!;

  const getHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const handleLogout = () => {
    localStorage.removeItem("ownerId");
    localStorage.removeItem("ownerName");
    localStorage.removeItem("authToken");
    window.dispatchEvent(new Event("logout"));
    router.push("/");
  };

  useEffect(() => {
    const ownerId = localStorage.getItem("ownerId");
    if (!ownerId) {
      setError("Usuario no autenticado");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await fetchJson(`/profile/${ownerId}`, undefined, LOCAL_API_URL, HOSTED_API_URL);
        setProfile(data);
        setNewDescription(data.Descrip || "");
        setUserTags(data.Tags || []);
      } catch (err: unknown) {
        console.error("Fetch profile error:", err);
        setError("No se pudo cargar el perfil");
      } finally {
        setLoading(false);
      }
    })();
  }, [LOCAL_API_URL, HOSTED_API_URL]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length > 500) {
      setDescError("La descripción no puede exceder 500 caracteres");
    } else {
      setDescError(null);
    }
    setNewDescription(val);
  };

  const handleUpdateProfile = async () => {
    if (!profile || descError) return;
    setSaving(true);
    const ownerId = localStorage.getItem("ownerId");
    if (!ownerId) return;

    try {
      const data = await fetchJson(
        `/profile/${ownerId}/description`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({ description: newDescription }),
        },
        LOCAL_API_URL,
        HOSTED_API_URL
      );
      setProfile(data);
      setNewDescription(data.Descrip || "");
      setUserTags(data.Tags || []);
      setError(null);
    } catch (err) {
      console.error("Error actualizando descripción:", err);
      setError("No se pudo actualizar la descripción");
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = async () => {
    const tag = newTag.trim();
    if (!tag) return;
    if (userTags.includes(tag)) {
      setTagError("Etiqueta duplicada");
      return;
    }
    const ownerId = localStorage.getItem("ownerId");
    if (!ownerId) return;

    try {
      const data = await fetchJson(
        `/profile/${ownerId}/tags`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ tag }),
        },
        LOCAL_API_URL,
        HOSTED_API_URL
      );
      setProfile(data);
      setUserTags(data.Tags || []);
      setNewTag("");
      setTagError(null);
      setError(null);
    } catch (err) {
      console.error("Error añadiendo etiqueta:", err);
      setError("No se pudo añadir la etiqueta");
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    const ownerId = localStorage.getItem("ownerId");
    if (!ownerId) return;

    try {
      const data = await fetchJson(
        `/profile/${ownerId}/tags`,
        {
          method: "DELETE",
          headers: getHeaders(),
          body: JSON.stringify({ tag: tagToRemove }),
        },
        LOCAL_API_URL,
        HOSTED_API_URL
      );
      setProfile(data);
      setUserTags(data.Tags || []);
      setError(null);
    } catch (err) {
      console.error("Error eliminando etiqueta:", err);
      setError("No se pudo eliminar la etiqueta");
    }
  };

  if (loading) return <p className="p-4">Cargando perfil...</p>;
  if (error || !profile)
    return <p className="p-4 text-red-500">{error || "Perfil no encontrado"}</p>;

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-300 bg-gray-50">
              {profile.ProfilePhoto ? (
                <Image
                  src={profile.ProfilePhoto}
                  width={96}
                  height={96}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="flex items-center justify-center h-full text-gray-400 text-xl">
                  ?
                </span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{profile.Name}</h2>
              <p className="text-gray-600 italic">{profile.Email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white uppercase px-4 py-2 rounded-lg shadow hover:bg-red-600 transition-colors duration-150"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Descripción */}
        <Card className="bg-white shadow-md rounded-lg">
          <CardContent>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Descripción</h3>
            <textarea
              className="w-full border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              rows={5}
              value={newDescription}
              onChange={handleDescriptionChange}
              placeholder="Escribe tu descripción..."
            />
            <div className="flex justify-between items-center mt-2">
              <p className={`text-sm ${
                newDescription.length > 500 ? 'text-red-500' : 'text-gray-500'
              }`}>{newDescription.length}/500</p>
              {descError && <p className="text-sm text-red-500">{descError}</p>}
            </div>
            <button
              onClick={handleUpdateProfile}
              disabled={saving || !!descError}
              className={`mt-4 w-full uppercase font-semibold py-2 rounded-lg shadow text-white transition-colors duration-150 ${
                saving || descError ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {saving ? 'Guardando...' : 'Guardar descripción'}
            </button>
          </CardContent>
        </Card>

        {/* Etiquetas */}
        <Card className="mt-6 bg-white shadow-md rounded-lg">
          <CardContent>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Etiquetas</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {userTags.map((tag) => (
                <span key={tag} className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => { setNewTag(e.target.value); setTagError(null); }}
                  placeholder="Nueva etiqueta"
                  className="w-full border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                {tagError && <p className="text-sm text-red-500 mt-1">{tagError}</p>}
              </div>
              <button
                onClick={handleAddTag}
                className="uppercase font-semibold px-4 py-2 rounded-lg shadow text-white transition-colors duration-150 bg-green-500 hover:bg-green-600"
              >
                Agregar
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

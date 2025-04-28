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
  Tags: string[];
}

export default function ProfileDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newDescription, setNewDescription] = useState<string>("");
  const [userTags, setUserTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [tagError, setTagError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Configurable API URLs
  const LOCAL_API_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL || "";
  const HOSTED_API_URL = process.env.NEXT_PUBLIC_API_URL!;

  // Common headers (with optional auth)
  const getHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Helper: fetch with optional local fallback and unwrap JSON wrapper
  const fetchJson = async (path: string, opts?: RequestInit) => {
    const tryLocal = LOCAL_API_URL
      ? fetch(`${LOCAL_API_URL}${path}`, opts).catch(() => null)
      : Promise.resolve(null);

    const resLocal = await tryLocal;
    const res = resLocal && resLocal.ok
      ? resLocal
      : await fetch(`${HOSTED_API_URL}${path}`, opts);

    if (!res.ok) throw new Error(`Error ${res.status}`);
    const json = await res.json();
    // API returns { success: boolean, data: OwnerProfile }
    const data = json.data;
    // Map Etiquetas to Tags if necessary
    if (data.Etiquetas) {
      data.Tags = data.Etiquetas;
      delete data.Etiquetas;
    }
    return data as Profile;
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("ownerId");
    localStorage.removeItem("ownerName");
    localStorage.removeItem("authToken");
    window.dispatchEvent(new Event("logout"));
    router.push("/");
  };

  // Fetch profile on mount
  useEffect(() => {
    const ownerId = localStorage.getItem("ownerId");
    if (!ownerId) {
      setError("Usuario no autenticado");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await fetchJson(`/profile/${ownerId}`);
        setProfile(data);
        setNewDescription(data.Descrip || "");
        setUserTags(data.Tags || []);
      } catch (err: any) {
        console.error("Fetch profile error:", err);
        setError("No se pudo cargar el perfil");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Update description
  const handleUpdateProfile = async () => {
    if (!profile) return;
    setSaving(true);
    const ownerId = localStorage.getItem("ownerId");
    if (!ownerId) return;

    try {
      // Send correct field name 'description'
      const data = await fetchJson(
        `/profile/${ownerId}/description`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({ description: newDescription }),
        }
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

  // Add tag
  const handleAddTag = async () => {
    const tag = newTag.trim();
    // Duplicate check
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
        }
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

  // Remove tag
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
        }
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
              <span className="flex items-center justify-center h-full text-gray-500">
                ?
              </span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{profile.Name}</h2>
            <p className="text-gray-500">{profile.Email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-black px-4 py-2 rounded hover:cursor-pointer transition-colors duration-150"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Descripción */}
      <Card className="mt-4 p-4">
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Descripción</h3>
          <textarea
            className="w-full border rounded p-2"
            rows={4}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <button
            onClick={handleUpdateProfile}
            disabled={saving}
            className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors"
          >
            {saving ? 'Guardando...' : 'Guardar descripción'}
          </button>
        </CardContent>
      </Card>

      {/* Etiquetas */}
      <Card className="mt-4 p-4">
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Etiquetas identificadoras</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {userTags.map((tag) => (
              <span key={tag} className="bg-gray-200 px-3 py-1 rounded flex items-center">
                {tag}
                <button onClick={() => handleRemoveTag(tag)} className="ml-1 text-red-500 hover:text-red-700">
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
                className="w-full border rounded p-1"
              />
              {tagError && <p className="text-sm text-red-500 mt-1">{tagError}</p>}
            </div>
            <button onClick={handleAddTag} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors">
              Agregar
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

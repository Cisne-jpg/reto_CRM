"use client";

import React, { useState, useEffect } from "react";

// Tipado según el endpoint GET /api/contacts
export interface Contact {
  ContactID: number;
  Name: string;
  Email: string;
  FotoPerfil: string;
  OrganizationID: number;
  OrganizationName: string;
  Industry: string;
}
// Task del kanban
interface KanbanTask {
  id: number;
  titulo: string;
  estado: string;
}

interface ContactCardProps {
  contact: Contact;
  onAddToKanban: (contact: Contact) => void;
  alreadyAdded: boolean;
  onDuplicate: (contact: Contact) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onAddToKanban, alreadyAdded, onDuplicate }) => {
  const btnText = alreadyAdded ? "Ya agregado" : `Trato con ${contact.Name}`;
  const btnClass = alreadyAdded ? "bg-gray-400 text-white py-2 px-4 rounded cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition";
  const handleClick = () => {
    if (alreadyAdded) onDuplicate(contact);
    else onAddToKanban(contact);
  };
  return (
    <div className="flex justify-between items-center p-4 mb-4 bg-white rounded-lg shadow">
      <div className="flex items-center gap-4">
        <img
          src={contact.FotoPerfil}
          alt="Foto de perfil"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="text-sm">
          <p><strong>Nombre:</strong> {contact.Name}</p>
          <p><strong>Email:</strong> {contact.Email}</p>
          <p><strong>Organización:</strong> {contact.OrganizationName}</p>
          <p><strong>Industria:</strong> {contact.Industry}</p>
        </div>
      </div>
      <button
        onClick={handleClick}
        className={btnClass}
        disabled={alreadyAdded}
      >
        {btnText}
      </button>
    </div>
  );
};

export default function Contactos() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [kanbanTitles, setKanbanTitles] = useState<string[]>([]);

  // URL base dinámica
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://api-crm-livid.vercel.app");

  useEffect(() => {
    const ownerId = localStorage.getItem("ownerId");
    if (!ownerId) {
      setError("Usuario no autorizado");
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        // Fetch contactos
        const resC = await fetch(`${API_BASE_URL}/api/contacts`);
        if (!resC.ok) throw new Error(`Error contacts ${resC.status}`);
        const jsonC = await resC.json();
        setContacts(jsonC.contacts);
        // Fetch kanban tasks
        const resK = await fetch(`${API_BASE_URL}/kanban/${ownerId}`);
        if (!resK.ok) throw new Error(`Error kanban ${resK.status}`);
        const jsonK: KanbanTask[] = await resK.json();
        setKanbanTitles(jsonK.map(t => t.titulo));
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError('No se pudieron cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [API_BASE_URL]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleAddToKanban = async (contact: Contact) => {
    try {
      const ownerId = localStorage.getItem("ownerId");
      if (!ownerId) throw new Error("OwnerID no encontrado");
      const title = `Trato con ${contact.Name}`;
      const body = JSON.stringify({
        titulo: title,
        descripcion: "",
        estado: "Revision",
        fecha_limite: new Date().toISOString().split('T')[0],
        prioridad: "media",
        owner_id: Number(ownerId)
      });
      const res = await fetch(`${API_BASE_URL}/kanban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (!res.ok) {
        const text = await res.text();
        console.error(`Kanban add failed ${res.status}:`, text);
        showToast("No se pudo agregar al kanban");
      } else {
        // Actualizar estado local
        setKanbanTitles(prev => [...prev, title]);
        showToast(`Tarea '${title}' agregada al kanban`);
      }
    } catch (err: any) {
      console.error('Add to kanban error:', err);
      showToast('Error al agregar al kanban');
    }
  };

  const handleDuplicate = (contact: Contact) => {
    showToast(`Ya tienes el trato con ${contact.Name} en el kanban`);
  };

  if (loading) return <p className="p-4">Cargando datos...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-blue-200 min-h-screen relative">
      {/* Toast emergente */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white py-2 px-4 rounded-lg shadow-lg">
          {toastMessage}
        </div>
      )}

      {/* Lista de contactos */}
      {contacts.length === 0 ? (
        <p>No hay contactos disponibles.</p>
      ) : (
        contacts.map((contact) => {
          const title = `Trato con ${contact.Name}`;
          const alreadyAdded = kanbanTitles.includes(title);
          return (
            <ContactCard
              key={contact.ContactID}
              contact={contact}
              onAddToKanban={handleAddToKanban}
              onDuplicate={handleDuplicate}
              alreadyAdded={alreadyAdded}
            />
          );
        })
      )}
    </div>
  );
}

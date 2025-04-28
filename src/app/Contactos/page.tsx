'use client';

import React, { useState, useEffect } from "react";

interface Contact {
  ContactID: number;
  Name: string;
  Email: string;
  FotoPerfil: string;
  OrganizationID: number;
  OrganizationName: string;
  Industry: string;
}

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

type Toast = {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
};

const ContactCard: React.FC<ContactCardProps> = ({ contact, onAddToKanban, alreadyAdded, onDuplicate }) => {
  const btnText = alreadyAdded ? "Trato existente" : `Iniciar trato con ${contact.Name}`;
  
  return (
    <div className="flex justify-between items-center p-6 mb-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-6">
        <img
          src={contact.FotoPerfil}
          alt="Foto de perfil"
          className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
        />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">{contact.Name}</h3>
          <p className="text-sm text-gray-600"><span className="font-medium">Email:</span> {contact.Email}</p>
          <p className="text-sm text-gray-600"><span className="font-medium">Organización:</span> {contact.OrganizationName}</p>
          <p className="text-sm text-gray-600"><span className="font-medium">Industria:</span> {contact.Industry}</p>
        </div>
      </div>
      <button
        onClick={() => alreadyAdded ? onDuplicate(contact) : onAddToKanban(contact)}
        className={`px-6 py-3 rounded-lg font-medium transition-all ${
          alreadyAdded 
            ? "bg-gray-100 text-gray-500 cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105"
        }`}
      >
        {btnText}
      </button>
    </div>
  );
};

export default function Contactos() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast>({ message: '', type: 'success', visible: false });
  const [kanbanTitles, setKanbanTitles] = useState<string[]>([]);

  const getApiBaseUrl = () => {
    const isLocal = typeof window !== 'undefined' && 
                   (window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1');
    return isLocal 
      ? 'http://localhost:3000' 
      : process.env.NEXT_PUBLIC_API_URL || 'https://api-crm-livid.vercel.app';
  };

  const API_BASE_URL = getApiBaseUrl();

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  useEffect(() => {
    const controller = new AbortController();
    const ownerId = localStorage.getItem("ownerId");
    
    const fetchData = async () => {
      if (!ownerId) {
        showToast("Debes iniciar sesión primero", 'error');
        setLoading(false);
        return;
      }

      try {
        // Fetch contactos
        const [contactsRes, kanbanRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/contacts`, { signal: controller.signal }),
          fetch(`${API_BASE_URL}/kanban/${ownerId}`, { signal: controller.signal })
        ]);

        if (!contactsRes.ok || !kanbanRes.ok) {
          throw new Error('Error al cargar datos');
        }

        const contactsData = await contactsRes.json();
        const kanbanData: KanbanTask[] = await kanbanRes.json();

        setContacts(contactsData.contacts);
        setKanbanTitles(kanbanData.map(t => t.titulo));
        
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Fetch error:', err);
          showToast('Error al cargar los datos', 'error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [API_BASE_URL]);

  const handleAddToKanban = async (contact: Contact) => {
    try {
      const ownerId = localStorage.getItem("ownerId");
      if (!ownerId) throw new Error("Usuario no autenticado");

      const taskData = {
        titulo: `Trato con ${contact.Name}`,
        descripcion: `Contacto: ${contact.Email}\nOrganización: ${contact.OrganizationName}`,
        estado: "Revision",
        fecha_limite: new Date().toISOString().split('T')[0],
        prioridad: "alta",
        owner_id: Number(ownerId)
      };

      const res = await fetch(`${API_BASE_URL}/kanban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al crear trato');
      }

      setKanbanTitles(prev => [...prev, taskData.titulo]);
      showToast(`Trato con ${contact.Name} creado!`, 'success');

    } catch (err: any) {
      console.error('Error adding deal:', err);
      showToast(err.message || 'Error al crear trato', 'error');
    }
  };

  const handleDuplicate = (contact: Contact) => {
    showToast(`Ya tienes un trato con ${contact.Name}`, 'error');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8 relative">
      {/* Toast Notification */}
      <div className={`fixed top-4 right-4 z-50 transition-opacity duration-300 ${toast.visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`${toast.type === 'success' ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'} 
          p-4 rounded-lg border-l-4 shadow-lg flex items-center gap-3 min-w-[300px]`}>
          {toast.type === 'success' ? (
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          <span className={`${toast.type === 'success' ? 'text-green-700' : 'text-red-700'} font-medium`}>
            {toast.message}
          </span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          📚 Directorio de Contactos
        </h1>

        {contacts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500">No se encontraron contactos</p>
          </div>
        ) : (
          <div className="space-y-6">
            {contacts.map((contact) => {
              const dealTitle = `Trato con ${contact.Name}`;
              const exists = kanbanTitles.includes(dealTitle);
              
              return (
                <ContactCard
                  key={contact.ContactID}
                  contact={contact}
                  onAddToKanban={handleAddToKanban}
                  onDuplicate={handleDuplicate}
                  alreadyAdded={exists}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
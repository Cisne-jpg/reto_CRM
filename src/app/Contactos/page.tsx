"use client"
import React, { useState } from "react";

interface Contact {
  id: number;
  name: string;
  company: string;
  contact: string;
  role: string;
}

interface ContactCardProps {
  contact: Contact;
  onDelete: (id: number) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onDelete }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', marginBottom: '1rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: '64px', height: '64px', backgroundColor: '#4ade80', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', textAlign: 'center' }}>
        Imagen de usuario
      </div>
      <div style={{ fontSize: '0.875rem' }}>
        <p><strong>Nombre:</strong> {contact.name}
        <strong>Empresa:</strong> {contact.company}</p>
        <p><strong>Contacto:</strong> {contact.contact}</p>
        <p><strong>Rol:</strong> {contact.role}</p>
      </div>
    </div>
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button onClick={() => onDelete(contact.id)} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '0.5rem', borderRadius: '4px' }}>X</button>
    </div>
  </div>
);

export default function Contactos() {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: "Juan Pérez", company: "Compañía X", contact: "juan@correo.com", role: "Vendedor" },
    { id: 2, name: "María García", company: "Empresa Y", contact: "maria@correo.com", role: "Comprador" },
  ]);

  const suggestedUsers: Contact[] = [
    { id: 3, name: "Carlos López", company: "Empresa Z", contact: "carlos@correo.com", role: "Otro" },
    { id: 4, name: "Ana Torres", company: "Comercial A", contact: "ana@correo.com", role: "Vendedor" },
    { id: 5, name: "Luis Fernández", company: "Proveedor B", contact: "luis@correo.com", role: "Comprador" }
  ];

  const [searchVisible, setSearchVisible] = useState(false);
  const [search, setSearch] = useState("");

  const handleDelete = (id: number) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const handleAdd = () => {
    setSearchVisible(true);
  };

  const handleSelectSuggestion = (user: Contact) => {
    if (!contacts.find(c => c.id === user.id)) {
      setContacts([...contacts, user]);
    }
    setSearch("");
    setSearchVisible(false);
  };

  const filteredSuggestions = suggestedUsers.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) &&
    !contacts.find(c => c.id === user.id)
  );

  return (
    <div style={{ padding: '1rem', backgroundColor: '#bfdbfe', minHeight: '100vh' }}>
      {!searchVisible && (
        <button
          onClick={handleAdd}
          style={{ marginBottom: '1rem', padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px' }}
        >
          Agregar contacto
        </button>
      )}

      {searchVisible && (
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Buscar usuario para agregar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <span role="img" aria-label="search">🔍</span>
          </div>
          {search && filteredSuggestions.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', marginTop: '0.5rem', zIndex: 10 }}>
              {filteredSuggestions.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleSelectSuggestion(user)}
                  style={{ padding: '0.5rem', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                >
                  {user.name} - {user.company}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '1rem' }}>
        {contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

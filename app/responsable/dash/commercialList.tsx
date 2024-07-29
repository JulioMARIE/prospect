'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';

interface Commercial {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
}

const commerciaux: Commercial[] = [
  { id: 1, nom: 'Dubois', prenom: 'Jean', email: 'jean.dubois@example.com', telephone: '0123456789' },
  { id: 2, nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@example.com', telephone: '0234567890' },
  { id: 3, nom: 'Bernard', prenom: 'Pierre', email: 'pierre.bernard@example.com', telephone: '0345678901' },
];

export default function CommercialList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [commerciauxList, setCommerciauxList] = useState<Commercial[]>(commerciaux);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredList = commerciaux.filter(
      (commercial) =>
        commercial.nom.toLowerCase().includes(term) ||
        commercial.prenom.toLowerCase().includes(term) ||
        commercial.email.toLowerCase().includes(term)
    );
    setCommerciauxList(filteredList);
  };

  const handleEdit = (id: number) => {
    // Logique pour éditer un commercial
    console.log(`Éditer le commercial avec l'ID ${id}`);
  };

  const handleDelete = (id: number) => {
    // Logique pour supprimer un commercial
    console.log(`Supprimer le commercial avec l'ID ${id}`);
    const updatedList = commerciauxList.filter((commercial) => commercial.id !== id);
    setCommerciauxList(updatedList);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Liste des Commerciaux</h2>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Rechercher un commercial..."
          className="w-full px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={handleSearch}
        />
        <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-3 text-gray-400" />
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Nom</th>
            <th className="py-2 px-4 border-b">Prénom</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Téléphone</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {commerciauxList.map((commercial) => (
            <tr key={commercial.id}>
              <td className="py-2 px-4 border-b">{commercial.nom}</td>
              <td className="py-2 px-4 border-b">{commercial.prenom}</td>
              <td className="py-2 px-4 border-b">{commercial.email}</td>
              <td className="py-2 px-4 border-b">{commercial.telephone}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEdit(commercial.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleDelete(commercial.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
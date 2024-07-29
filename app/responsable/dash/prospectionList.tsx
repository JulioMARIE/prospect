'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEye } from '@fortawesome/free-solid-svg-icons';

interface Prospection {
  id: number;
  commercialId: number;
  commercialNom: string;
  dateProspection: string;
  entreprise: string;
  contact: string;
  statut: 'En cours' | 'Terminé' | 'Annulé';
}

const prospections: Prospection[] = [
  { id: 1, commercialId: 1, commercialNom: 'Jean Dubois', dateProspection: '2024-02-15', entreprise: 'Entreprise A', contact: 'Marie Dupont', statut: 'En cours' },
  { id: 2, commercialId: 2, commercialNom: 'Sophie Martin', dateProspection: '2024-02-16', entreprise: 'Entreprise B', contact: 'Paul Martin', statut: 'Terminé' },
  { id: 3, commercialId: 3, commercialNom: 'Pierre Bernard', dateProspection: '2024-02-17', entreprise: 'Entreprise C', contact: 'Lucie Durand', statut: 'Annulé' },
];

export default function ProspectionList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [prospectionsList, setProspectionsList] = useState<Prospection[]>(prospections);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredList = prospections.filter(
      (prospection) =>
        prospection.commercialNom.toLowerCase().includes(term) ||
        prospection.entreprise.toLowerCase().includes(term) ||
        prospection.contact.toLowerCase().includes(term)
    );
    setProspectionsList(filteredList);
  };

  const handleViewDetails = (id: number) => {
    // Logique pour afficher les détails de la prospection
    console.log(`Afficher les détails de la prospection avec l'ID ${id}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Liste des Prospections</h2>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Rechercher une prospection..."
          className="w-full px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={handleSearch}
        />
        <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-3 text-gray-400" />
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Commercial</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Entreprise</th>
            <th className="py-2 px-4 border-b">Contact</th>
            <th className="py-2 px-4 border-b">Statut</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {prospectionsList.map((prospection) => (
            <tr key={prospection.id}>
              <td className="py-2 px-4 border-b">{prospection.commercialNom}</td>
              <td className="py-2 px-4 border-b">{prospection.dateProspection}</td>
              <td className="py-2 px-4 border-b">{prospection.entreprise}</td>
              <td className="py-2 px-4 border-b">{prospection.contact}</td>
              <td className="py-2 px-4 border-b">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  prospection.statut === 'En cours' ? 'bg-yellow-200 text-yellow-800' :
                  prospection.statut === 'Terminé' ? 'bg-green-200 text-green-800' :
                  'bg-red-200 text-red-800'
                }`}>
                  {prospection.statut}
                </span>
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleViewDetails(prospection.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface Quota {
  id: number;
  commercialId: number;
  commercialNom: string;
  dateDebut: string;
  dateFin: string;
  nombreCible: number;
  nombreRealise: number;
}

const quotas: Quota[] = [
  { id: 1, commercialId: 1, commercialNom: 'Jean Dubois', dateDebut: '2024-01-01', dateFin: '2024-03-31', nombreCible: 50, nombreRealise: 45 },
  { id: 2, commercialId: 2, commercialNom: 'Sophie Martin', dateDebut: '2024-01-01', dateFin: '2024-03-31', nombreCible: 40, nombreRealise: 42 },
  { id: 3, commercialId: 3, commercialNom: 'Pierre Bernard', dateDebut: '2024-01-01', dateFin: '2024-03-31', nombreCible: 60, nombreRealise: 55 },
];

export default function QuotaList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [quotasList, setQuotasList] = useState<Quota[]>(quotas);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredList = quotas.filter(
      (quota) =>
        quota.commercialNom.toLowerCase().includes(term) ||
        quota.dateDebut.includes(term) ||
        quota.dateFin.includes(term)
    );
    setQuotasList(filteredList);
  };

  const getStatus = (quota: Quota) => {
    return quota.nombreRealise >= quota.nombreCible ? 'Atteint' : 'Non atteint';
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Liste des Quotas</h2>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Rechercher un quota..."
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
            <th className="py-2 px-4 border-b">Date de début</th>
            <th className="py-2 px-4 border-b">Date de fin</th>
            <th className="py-2 px-4 border-b">Nombre cible</th>
            <th className="py-2 px-4 border-b">Nombre réalisé</th>
            <th className="py-2 px-4 border-b">Statut</th>
          </tr>
        </thead>
        <tbody>
          {quotasList.map((quota) => (
            <tr key={quota.id}>
              <td className="py-2 px-4 border-b">{quota.commercialNom}</td>
              <td className="py-2 px-4 border-b">{quota.dateDebut}</td>
              <td className="py-2 px-4 border-b">{quota.dateFin}</td>
              <td className="py-2 px-4 border-b">{quota.nombreCible}</td>
              <td className="py-2 px-4 border-b">{quota.nombreRealise}</td>
              <td className={`py-2 px-4 border-b ${getStatus(quota) === 'Atteint' ? 'text-green-600' : 'text-red-600'}`}>
                {getStatus(quota)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import api from '../../utils/api';

interface Commercial {
  id: number;
  utilisateur: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
}

export default function CommercialList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [commerciauxList, setCommerciauxList] = useState<Commercial[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCommercial, setNewCommercial] = useState({ nom: '', prenom: '', email: '' });
  const [editingCommercial, setEditingCommercial] = useState<Commercial | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCommerciaux();
  }, []);

  const fetchCommerciaux = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/responsable/commercials');
      setCommerciauxList(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des commerciaux:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
  };

  const filteredList = commerciauxList.filter(
    (commercial) =>
      commercial.utilisateur.nom.toLowerCase().includes(searchTerm) ||
      commercial.utilisateur.prenom.toLowerCase().includes(searchTerm) ||
      commercial.utilisateur.email.toLowerCase().includes(searchTerm)
  );

  const handleEdit = (commercial: Commercial) => {
    setEditingCommercial(commercial);
    setNewCommercial({
      nom: commercial.utilisateur.nom,
      prenom: commercial.utilisateur.prenom,
      email: commercial.utilisateur.email,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    try {
      await api.delete(`/responsable/commercials/${id}`);
      fetchCommerciaux();
    } catch (error) {
      console.error('Erreur lors de la suppression du commercial:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingCommercial) {
        await api.put(`/responsable/commercials/${editingCommercial.id}`, newCommercial);
      } else {
        await api.post('/responsable/commercials', newCommercial);
      }
      fetchCommerciaux();
      setShowAddForm(false);
      setNewCommercial({ nom: '', prenom: '', email: '' });
      setEditingCommercial(null);
    } catch (error) {
      console.error('Erreur lors de l\'ajout/modification du commercial:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Liste des Commerciaux</h2>
      <div className="mb-4 flex justify-between items-center">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Rechercher un commercial..."
            className="w-full px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-3 text-gray-400" />
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingCommercial(null);
            setNewCommercial({ nom: '', prenom: '', email: '' });
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Ajouter un commercial
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded-md">
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nom"
              value={newCommercial.nom}
              onChange={(e) => setNewCommercial({...newCommercial, nom: e.target.value})}
              className="px-4 py-2 border rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Prénom"
              value={newCommercial.prenom}
              onChange={(e) => setNewCommercial({...newCommercial, prenom: e.target.value})}
              className="px-4 py-2 border rounded-md"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newCommercial.email}
              onChange={(e) => setNewCommercial({...newCommercial, email: e.target.value})}
              className="px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
              {editingCommercial ? 'Modifier' : 'Ajouter'}
            </button>
            <button type="button" onClick={() => setShowAddForm(false)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Annuler
            </button>
          </div>
        </form>
      )}

      {isLoading && (
        <div className="flex justify-center items-center my-4">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        </div>
      )}

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Nom</th>
            <th className="py-2 px-4 border-b">Prénom</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.map((commercial) => (
            <tr key={commercial.id}>
              <td className="py-2 px-4 border-b">{commercial.utilisateur.nom}</td>
              <td className="py-2 px-4 border-b">{commercial.utilisateur.prenom}</td>
              <td className="py-2 px-4 border-b">{commercial.utilisateur.email}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEdit(commercial)}
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
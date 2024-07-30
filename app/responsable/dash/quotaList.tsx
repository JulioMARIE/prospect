'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import api from '../../utils/api';

interface Quota {
  id: number;
  date_debut: string;
  date_fin: string;
  nombre_fixe: number;
  nombre_fait: number;
  statut: number;
}

export default function QuotaList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [quotasList, setQuotasList] = useState<Quota[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuota, setNewQuota] = useState({
    date_debut: '',
    date_fin: '',
    nombre_fixe: 0,
  });
  const [editingQuota, setEditingQuota] = useState<Quota | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchQuotas();
  }, []);

  const fetchQuotas = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/responsable/quotas');
      setQuotasList(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des quotas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
  };

  const filteredList = quotasList.filter(
    (quota) =>
      quota.date_debut.toLowerCase().includes(searchTerm) ||
      quota.date_fin.toLowerCase().includes(searchTerm)
  );

  const handleEdit = (quota: Quota) => {
    setEditingQuota(quota);
    setNewQuota({
      date_debut: quota.date_debut,
      date_fin: quota.date_fin,
      nombre_fixe: quota.nombre_fixe,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    try {
      await api.delete(`/responsable/quotas/${id}`);
      fetchQuotas();
    } catch (error) {
      console.error('Erreur lors de la suppression du quota:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingQuota) {
        await api.put(`/responsable/quotas/${editingQuota.id}`, newQuota);
      } else {
        await api.post('/responsable/quotas', newQuota);
      }
      fetchQuotas();
      setShowAddForm(false);
      setNewQuota({ date_debut: '', date_fin: '', nombre_fixe: 0 });
      setEditingQuota(null);
    } catch (error) {
      console.error('Erreur lors de l\'ajout/modification du quota:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Liste des Quotas</h2>
      <div className="mb-4 flex justify-between items-center">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Rechercher un quota..."
            className="w-full px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-3 text-gray-400" />
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingQuota(null);
            setNewQuota({ date_debut: '', date_fin: '', nombre_fixe: 0 });
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Ajouter un quota
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded-md">
          <div className="grid grid-cols-3 gap-4">
            <input
              type="date"
              placeholder="Date de début"
              value={newQuota.date_debut}
              onChange={(e) => setNewQuota({...newQuota, date_debut: e.target.value})}
              className="px-4 py-2 border rounded-md"
              required
            />
            <input
              type="date"
              placeholder="Date de fin"
              value={newQuota.date_fin}
              onChange={(e) => setNewQuota({...newQuota, date_fin: e.target.value})}
              className="px-4 py-2 border rounded-md"
              required
            />
            <input
              type="number"
              placeholder="Nombre fixe"
              value={newQuota.nombre_fixe}
              onChange={(e) => setNewQuota({...newQuota, nombre_fixe: parseInt(e.target.value, 10)})}
              className="px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
              {editingQuota ? 'Modifier' : 'Ajouter'}
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
            <th className="py-2 px-4 border-b">Date de début</th>
            <th className="py-2 px-4 border-b">Date de fin</th>
            <th className="py-2 px-4 border-b">Nombre fixe</th>
            <th className="py-2 px-4 border-b">Nombre fait</th>
            <th className="py-2 px-4 border-b">Statut</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.map((quota) => (
            <tr key={quota.id}>
              <td className="py-2 px-4 border-b">{quota.date_debut}</td>
              <td className="py-2 px-4 border-b">{quota.date_fin}</td>
              <td className="py-2 px-4 border-b">{quota.nombre_fixe}</td>
              <td className="py-2 px-4 border-b">{quota.nombre_fait}</td>
              <td className="py-2 px-4 border-b">{quota.statut}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEdit(quota)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleDelete(quota.id)}
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

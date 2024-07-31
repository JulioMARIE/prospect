import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faPlus, faSpinner, faList } from '@fortawesome/free-solid-svg-icons';
import api from '../../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FollowUp {
  id: number;
  date_heure: string;
  observation: string;
  prospection_id: number;
}

interface Prospect {
  id: number;
  date_heure: string;
  personne_rencontree: string;
  contact_pers_rencont: string;
  fonction_pers_rencont: string;
  logiciels: string;
  observations: string;
  commercial_id: number;
  societe_id: number;
  commercial: {
    id: number;
    utilisateur: {
      id: number;
      nom: string;
      prenom: string;
      email: string;
    };
  };
  societe: {
    id: number;
    denomination: string;
    raison_sociale: string;
    IFU: string;
    description_siege: string;
    commune_id: number;
  };
  suivis: FollowUp[];
}

export default function ProspectionList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [prospectionsList, setCommerciauxList] = useState<Prospect[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quotasToShow, setQuotasToShow] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchProspections();
  }, []);

  const fetchProspections = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/responsable/prospections');
      setCommerciauxList(response.data);
    } catch (error) {
      toast.error('Erreur lors de la récupération des prospections');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredList = prospectionsList.filter(
    (prospection) =>
      prospection.date_heure.toLowerCase().includes(searchTerm) ||
      prospection.contact_pers_rencont.toLowerCase().includes(searchTerm) ||
      prospection.fonction_pers_rencont.toLowerCase().includes(searchTerm) ||
      prospection.personne_rencontree.toLowerCase().includes(searchTerm) ||
      prospection.societe.denomination.toLowerCase().includes(searchTerm) ||
      prospection.commercial.utilisateur.nom.toLowerCase().includes(searchTerm) ||
      prospection.commercial.utilisateur.prenom.toLowerCase().includes(searchTerm) ||
      prospection.observations.toLowerCase().includes(searchTerm)
  );

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    try {
      console.log(`del :/responsable/prospections/${id}`);
      await api.delete(`/responsable/prospections/${id}`);
      toast.success('Prospection supprimée avec succès!');
      fetchProspections();
    } catch (error) {
      toast.error('Erreur lors de la suppression de la prospection');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuota = async (id: number) => {
    setIsLoading(true);
    try {
      await api.delete(`/responsable/suivis/${id}`);
      toast.success('Suivi supprimé avec succès!');
      fetchProspections();
    } catch (error) {
      toast.error('Erreur lors de la suppression du suivi');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSuivis = (prospectionId: number) => {
    setQuotasToShow((prev) => ({
      ...prev,
      [prospectionId]: !prev[prospectionId],
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Liste des prospections</h2>
      <div className="mb-4 flex justify-between items-center">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Rechercher une prospection..."
            className="w-full px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-3 text-gray-400" />
        </div>
      </div>

      <ToastContainer />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        </div>
      ) : (
        <div>
          {filteredList.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Commercial</th>
                  <th className="p-3 text-left">Société</th>
                  <th className="p-3 text-left">Personne rencontrée</th>
                  <th className="p-3 text-left">Contact</th>
                  <th className="p-3 text-left">Fonction</th>
                  <th className="p-3 text-left">Observations</th>
                  <th className="p-3 text-left">Actions</th>
                  <th className="p-3 text-left">Suivis</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((prospection) => (
                  <React.Fragment key={prospection.id}>
                    <tr className="border-b">
                      <td className="p-3">{prospection.date_heure}</td>
                      <td className="p-3">{prospection.commercial.utilisateur.nom} {prospection.commercial.utilisateur.prenom}</td>
                      <td className="p-3">{prospection.societe.denomination} {prospection.societe.IFU}</td>
                      <td className="p-3">{prospection.personne_rencontree}</td>
                      <td className="p-3">{prospection.contact_pers_rencont}</td>
                      <td className="p-3">{prospection.fonction_pers_rencont}</td>
                      <td className="p-3">{prospection.observations}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDelete(prospection.id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => toggleSuivis(prospection.id)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                        >
                          Suivi(s) <FontAwesomeIcon icon={faList} className="mr-2" />
                          {prospection.suivis.length}
                        </button>
                      </td>
                    </tr>
                    {quotasToShow[prospection.id] && (
                      <tr>
                        <td colSpan={9} className="p-4 bg-gray-100">
                          {prospection.suivis.length > 0 ? (
                            <ul>
                              {prospection.suivis.map((suivi) => (
                                <li
                                  key={suivi.id}
                                  className="p-2 mb-2 border rounded-md"
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p>Date: {new Date(suivi.date_heure).toLocaleDateString()}</p>
                                      <p>Observation: {suivi.observation}</p>
                                    </div>
                                    {/* <button
                                      onClick={() => handleDeleteQuota(suivi.id)}
                                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                    >
                                      <FontAwesomeIcon icon={faTrash} />
                                    </button> */}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>Aucun suivi trouvé.</p>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Aucune prospection trouvée.</p>
          )}
        </div>
      )}
    </div>
  );
}

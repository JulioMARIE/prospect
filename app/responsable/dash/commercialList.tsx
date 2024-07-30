import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faPlus, faSpinner, faList } from '@fortawesome/free-solid-svg-icons';
import api from '../../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import { useFormik } from 'formik';

interface Quota {
  id: number;
  date_debut: string;
  date_fin: string;
  nombre_fixe: number;
  nombre_fait: number;
  statut: number;
}

interface Commercial {
  id: number;
  utilisateur: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  quotas: Quota[];
}

const quotaValidationSchema = Yup.object().shape({
  date_debut: Yup.date().required('Date début est requise'),
  date_fin: Yup.date()
    .min(Yup.ref('date_debut'), 'Date fin doit être après la date début')
    .required('Date fin est requise'),
  nombre_fixe: Yup.number().positive('Nombre fixe doit être un nombre positif').required('Nombre fixe est requis'),
});

export default function CommercialList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [commerciauxList, setCommerciauxList] = useState<Commercial[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCommercial, setNewCommercial] = useState({ nom: '', prenom: '', email: '' });
  const [editingCommercial, setEditingCommercial] = useState<Commercial | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quotasToShow, setQuotasToShow] = useState<{ [key: number]: boolean }>({});
  const [showAddQuotaForm, setShowAddQuotaForm] = useState<{ [key: number]: boolean }>({});
  const [editingQuota, setEditingQuota] = useState<Quota | null>(null);

  const formik = useFormik({
    initialValues: {
      date_debut: '',
      date_fin: '',
      nombre_fixe: 0,
    },
    validationSchema: quotaValidationSchema,
    onSubmit: async (values) => {
      const commercialId = Object.keys(showAddQuotaForm)[0];
      if (commercialId) {
        try {
          await api.post('/responsable/addquota/', {
            ...values,
            commercial_id: parseInt(commercialId),
          });
          toast.success('Quota ajouté avec succès!');
          fetchCommerciaux();
          setShowAddQuotaForm((prev) => ({ ...prev, [parseInt(commercialId)]: false }));
          formik.resetForm();
        } catch (error) {
          toast.error('Erreur lors de l\'ajout du quota');
        }
      }
    },
  });

  useEffect(() => {
    fetchCommerciaux();
  }, []);

  const fetchCommerciaux = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/responsable/commercials');
      setCommerciauxList(response.data);
    } catch (error) {
      toast.error('Erreur lors de la récupération des commerciaux');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
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
      toast.success('Commercial supprimé avec succès!');
      fetchCommerciaux();
    } catch (error) {
      toast.error('Erreur lors de la suppression du commercial');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuota = async (id: number) => {
    setIsLoading(true);
    try {
      await api.delete(`/responsable/quotas/${id}`);
      toast.success('Quota supprimé avec succès!');
      fetchCommerciaux();
    } catch (error) {
      toast.error('Erreur lors de la suppression du quota');
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
        toast.success('Commercial modifié avec succès!');
      } else {
        await api.post('/responsable/commercials', newCommercial);
        toast.success('Commercial ajouté avec succès!');
      }
      fetchCommerciaux();
      setShowAddForm(false);
      setNewCommercial({ nom: '', prenom: '', email: '' });
      setEditingCommercial(null);
    } catch (error) {
      toast.error('Erreur lors de l\'ajout/modification du commercial');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuotas = (commercialId: number) => {
    setQuotasToShow((prev) => ({
      ...prev,
      [commercialId]: !prev[commercialId],
    }));
    setShowAddQuotaForm((prev) => ({ ...prev, [commercialId]: false }));
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
              onChange={(e) => setNewCommercial({ ...newCommercial, nom: e.target.value })}
              className="px-4 py-2 border rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Prénom"
              value={newCommercial.prenom}
              onChange={(e) => setNewCommercial({ ...newCommercial, prenom: e.target.value })}
              className="px-4 py-2 border rounded-md"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newCommercial.email}
              onChange={(e) => setNewCommercial({ ...newCommercial, email: e.target.value })}
              className="px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
              {editingCommercial ? 'Modifier' : 'Ajouter'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <ToastContainer />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        </div>
      ) : (
        <div>
          {filteredList.length > 0 ? (
            <ul>
              {filteredList.map((commercial) => (
                <li key={commercial.id} className="mb-4 p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="text-xl font-bold">
                        {commercial.utilisateur.nom} {commercial.utilisateur.prenom}
                      </h3>
                      <p className="text-gray-600">{commercial.utilisateur.email}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(commercial)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDelete(commercial.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleQuotas(commercial.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
                  >
                    <FontAwesomeIcon icon={faList} className="mr-2" />
                    Quotas ({commercial.quotas.length})
                  </button>

                  {quotasToShow[commercial.id] && (
                    <div className="border-t mt-4 pt-2">
                      {commercial.quotas.length > 0 ? (
                        <ul>
                          {commercial.quotas.map((quota) => (
                            <li
                              key={quota.id}
                              className={`p-2 mb-2 rounded-md ${quota.statut === 0 ? 'bg-red-100' : 'bg-green-100'}`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p>Date début: {new Date(quota.date_debut).toLocaleDateString()}</p>
                                  <p>Date fin: {new Date(quota.date_fin).toLocaleDateString()}</p>
                                  <p>Nombre fixe: {quota.nombre_fixe}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => {
                                      setEditingQuota(quota);
                                      formik.setValues({
                                        date_debut: quota.date_debut,
                                        date_fin: quota.date_fin,
                                        nombre_fixe: quota.nombre_fixe,
                                      });
                                      setShowAddQuotaForm((prev) => ({
                                        ...prev,
                                        [commercial.id]: true,
                                      }));
                                    }}
                                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
                                  >
                                    <FontAwesomeIcon icon={faEdit} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteQuota(quota.id)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>Aucun quota trouvé.</p>
                      )}
                    </div>
                  )}

                  {showAddQuotaForm[commercial.id] && (
                    <form onSubmit={formik.handleSubmit} className="mt-4 p-4 border rounded-md">
                      <div className="grid grid-cols-1 gap-4">
                        <input
                          type="date"
                          name="date_debut"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.date_debut}
                          className="px-4 py-2 border rounded-md"
                        />
                        {formik.touched.date_debut && formik.errors.date_debut ? (
                          <div className="text-red-500">{formik.errors.date_debut}</div>
                        ) : null}

                        <input
                          type="date"
                          name="date_fin"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.date_fin}
                          className="px-4 py-2 border rounded-md"
                        />
                        {formik.touched.date_fin && formik.errors.date_fin ? (
                          <div className="text-red-500">{formik.errors.date_fin}</div>
                        ) : null}

                        <input
                          type="number"
                          name="nombre_fixe"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.nombre_fixe}
                          className="px-4 py-2 border rounded-md"
                        />
                        {formik.touched.nombre_fixe && formik.errors.nombre_fixe ? (
                          <div className="text-red-500">{formik.errors.nombre_fixe}</div>
                        ) : null}
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button
                          type="submit"
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                          {editingQuota ? 'Modifier' : 'Ajouter'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddQuotaForm((prev) => ({
                            ...prev,
                            [commercial.id]: false,
                          }))}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun commercial trouvé.</p>
          )}
        </div>
      )}
    </div>
  );
}

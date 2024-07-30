import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Commercial {
  id: number;
  utilisateur_id: number;
  utilisateur: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  quotas: any[]; // Assume appropriate type for quotas
}

interface Permission {
  id: number;
  libelle_perm: string;
}

const AssignPermissionForm: React.FC = () => {
  const [commercials, setCommercials] = useState<Commercial[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedCommercial, setSelectedCommercial] = useState<number | undefined>();
  const [selectedPermission, setSelectedPermission] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCommercials();
    fetchPermissions();
  }, []);

  const fetchCommercials = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/responsable/commercials');
      setCommercials(response.data);
    } catch (error) {
      toast.error('Erreur lors de la récupération des commerciaux');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPermissions = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/responsable/permissions');
      setPermissions(response.data);
    } catch (error) {
      toast.error('Erreur lors de la récupération des permissions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedCommercial === undefined || selectedPermission === undefined) {
      toast.error('Veuillez sélectionner un commercial et une permission.');
      return;
    }

    setIsLoading(true);
    try {
      await api.post(`/responsable/addPermission/${selectedCommercial}`, {
        // commercial_id: selectedCommercial,
        permission_id: [selectedPermission],
      });
      toast.success('Permission assignée avec succès!');
    } catch (error) {
      toast.error('Erreur lors de l\'assignation de la permission');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Affecter une Permission</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="commercial" className="mb-2 font-semibold">Commercial</label>
          <select
            id="commercial"
            value={selectedCommercial}
            onChange={(e) => setSelectedCommercial(Number(e.target.value))}
            className="border rounded-md p-2"
          >
            <option value="">Sélectionner un commercial</option>
            {commercials.map((commercial) => (
              <option key={commercial.id} value={commercial.utilisateur_id}>
                {`${commercial.utilisateur.prenom} ${commercial.utilisateur.nom}`}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="permission" className="mb-2 font-semibold">Permission</label>
          <select
            id="permission"
            value={selectedPermission}
            onChange={(e) => setSelectedPermission(Number(e.target.value))}
            className="border rounded-md p-2"
          >
            <option value="">Sélectionner une permission</option>
            {permissions.map((permission) => (
              <option key={permission.id} value={permission.id}>
                {permission.libelle_perm}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className={`px-4 py-2 rounded-md text-white ${isLoading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'}`}
          disabled={isLoading}
        >
          {isLoading ? 'Chargement...' : 'Valider'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AssignPermissionForm;

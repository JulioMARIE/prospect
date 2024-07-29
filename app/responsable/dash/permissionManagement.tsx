'use client';

import React, { useState } from 'react';

interface User {
  id: number;
  nom: string;
  prenom: string;
  role: string;
}

interface Permission {
  id: number;
  nom: string;
}

const users: User[] = [
  { id: 1, nom: 'Dubois', prenom: 'Jean', role: 'Commercial' },
  { id: 2, nom: 'Martin', prenom: 'Sophie', role: 'Responsable' },
  { id: 3, nom: 'Bernard', prenom: 'Pierre', role: 'Commercial' },
];

const permissions: Permission[] = [
  { id: 1, nom: 'Gérer les commerciaux' },
  { id: 2, nom: 'Gérer les quotas' },
  { id: 3, nom: 'Voir les prospections' },
  { id: 4, nom: 'Modifier les prospections' },
];

export default function PermissionManagement() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = parseInt(event.target.value);
    const user = users.find(u => u.id === userId) || null;
    setSelectedUser(user);
    setSelectedPermissions([]);  // Reset permissions when user changes
  };

  const handlePermissionChange = (permissionId: number) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedUser) {
      console.log(`Mise à jour des permissions pour ${selectedUser.prenom} ${selectedUser.nom}`);
      console.log('Permissions sélectionnées:', selectedPermissions);
      // Ici, vous ajouteriez la logique pour sauvegarder les permissions dans votre backend
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestion des Permissions</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="user" className="block text-sm font-medium text-gray-700">Sélectionner un utilisateur</label>
          <select
            id="user"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            onChange={handleUserChange}
            value={selectedUser?.id || ''}
          >
            <option value="">Sélectionner un utilisateur</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.prenom} {user.nom} ({user.role})</option>
            ))}
          </select>
        </div>
        {selectedUser && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Permissions pour {selectedUser.prenom} {selectedUser.nom}</h3>
            <div className="space-y-2">
              {permissions.map(permission => (
                <div key={permission.id} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={`permission-${permission.id}`}
                      type="checkbox"
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() => handlePermissionChange(permission.id)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor={`permission-${permission.id}`} className="font-medium text-gray-700">{permission.nom}</label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={!selectedUser}
          >
            Enregistrer les permissions
          </button>
        </div>
      </form>
    </div>
  );
}
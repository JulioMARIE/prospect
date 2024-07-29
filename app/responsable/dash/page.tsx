'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CommercialList from './commercialList';
import QuotaList from './quotaList';
import ProspectionList from './prospectionList';
import PermissionManagement from './permissionManagement';
import ChangePassword from './changePassword';

export default function ResponsableDashboard() {
  const [activeTab, setActiveTab] = useState('commercials');
  const router = useRouter();

  const user = localStorage.getItem('user');

  console.log('local storage data:', user);

  const handleLogout = () => {
    // Logique de déconnexion
    router.push('responsable');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-purple-600">Dashboard</h2>
        </div>
        <nav className="mt-4">
          <button
            className={`w-full text-left p-4 ${activeTab === 'commercials' ? 'bg-purple-100 text-purple-600' : ''}`}
            onClick={() => setActiveTab('commercials')}
          >
            Commerciaux
          </button>
          <button
            className={`w-full text-left p-4 ${activeTab === 'quotas' ? 'bg-purple-100 text-purple-600' : ''}`}
            onClick={() => setActiveTab('quotas')}
          >
            Quotas
          </button>
          <button
            className={`w-full text-left p-4 ${activeTab === 'prospections' ? 'bg-purple-100 text-purple-600' : ''}`}
            onClick={() => setActiveTab('prospections')}
          >
            Prospections
          </button>
          <button
            className={`w-full text-left p-4 ${activeTab === 'permissions' ? 'bg-purple-100 text-purple-600' : ''}`}
            onClick={() => setActiveTab('permissions')}
          >
            Permissions
          </button>
          <button
            className={`w-full text-left p-4 ${activeTab === 'profile' ? 'bg-purple-100 text-purple-600' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profil
          </button>
        </nav>
        <button
          className="w-full text-left p-4 text-red-600 hover:bg-red-100"
          onClick={handleLogout}
        >
          Déconnexion
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        {activeTab === 'commercials' && <CommercialList />}
        {activeTab === 'quotas' && <QuotaList />}
        {activeTab === 'prospections' && <ProspectionList />}
        {activeTab === 'permissions' && <PermissionManagement />}
        {activeTab === 'profile' && <ChangePassword />}
      </div>
    </div>
  );
}
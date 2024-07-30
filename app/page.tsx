'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faPlus, faList, faBullseye, faUserCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import CommercialList from './responsable/dash/commercialList';
import ProspectionList from './responsable/dash/prospectionList';
import PermissionManagement from './responsable/dash/permissionManagement';
import ProfilePage from './responsable/dash/profilPage';
import withAuth from './utils/withAuth';

const ResponsableDashboard = () => {
  const [activeTab, setActiveTab] = useState('commercials');
  const router = useRouter();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.utilisateur.nom || 'Utilisateur';
  const userSurname = user.surname || '';

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-purple-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
        <div className="flex justify-center mb-5">
          <Image src="/logo.png" alt="Logo" width={40} height={40} className="logo-white"/>
        </div>
        <nav>
          <button
            className={`w-full text-left py-2.5 px-4 rounded transition duration-200 ${activeTab === 'commercials' ? 'bg-purple-700' : 'hover:bg-purple-700'}`}
            onClick={() => setActiveTab('commercials')}
          >
            <FontAwesomeIcon icon={faList} className="mr-2" /> Commerciaux
          </button>
          <button
            className={`w-full text-left py-2.5 px-4 rounded transition duration-200 ${activeTab === 'prospections' ? 'bg-purple-700' : 'hover:bg-purple-700'}`}
            onClick={() => setActiveTab('prospections')}
          >
            <FontAwesomeIcon icon={faBullseye} className="mr-2" /> Prospections
          </button>
          <button
            className={`w-full text-left py-2.5 px-4 rounded transition duration-200 ${activeTab === 'permissions' ? 'bg-purple-700' : 'hover:bg-purple-700'}`}
            onClick={() => setActiveTab('permissions')}
          >
            <FontAwesomeIcon icon={faUserCog} className="mr-2" /> Permissions
          </button>
          <button
            className={`w-full text-left py-2.5 px-4 rounded transition duration-200 ${activeTab === 'profile' ? 'bg-purple-700' : 'hover:bg-purple-700'}`}
            onClick={() => setActiveTab('profile')}
          >
            <FontAwesomeIcon icon={faUserCircle} className="mr-2" /> Profil
          </button>
        </nav>
        <button
          className="w-full text-left py-2.5 px-4 text-red-300 hover:bg-red-700 hover:text-white rounded transition duration-200"
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Déconnexion
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-purple-800">Prospect</h1>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faUserCircle} size="2x" className="text-purple-600 mr-2" />
              <div>
                <h2 className="text-xl font-semibold text-purple-600">{userName} {userSurname}</h2>
                <p className="text-sm text-gray-600">Responsable</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            {activeTab === 'commercials' && <CommercialList />}
            {activeTab === 'prospections' && <ProspectionList />}
            {activeTab === 'permissions' && <PermissionManagement />}
            {activeTab === 'profile' && <div className="h-full flex items-center justify-center"><ProfilePage /></div>}
          </div>
        </main>
      </div>
    </div>
  );
}

export default withAuth(ResponsableDashboard);
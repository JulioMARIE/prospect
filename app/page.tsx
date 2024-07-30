'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CommercialList from './responsable/dash/commercialList';
// import QuotaList from './responsable/dash/quotaList';
import ProspectionList from './responsable/dash/prospectionList';
import PermissionManagement from './responsable/dash/permissionManagement';
import ChangePassword from './responsable/dash/changePassword';
import withAuth from './utils/withAuth';
import { logout } from './utils/auth';

const ResponsableDashboard = () => {
  const [activeTab, setActiveTab] = useState('commercials');
  const router = useRouter();

  const user = localStorage.getItem('user');

  console.log('local storage data:', user);


  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-purple-600">Tableau de bord</h2>
        </div>
        <nav className="mt-4">
          <button
            className={`w-full text-left p-4 ${activeTab === 'commercials' ? 'bg-purple-100 text-purple-600' : ''}`}
            onClick={() => setActiveTab('commercials')}
          >
            Commerciaux
          </button>
          {/* <button
            className={`w-full text-left p-4 ${activeTab === 'quotas' ? 'bg-purple-100 text-purple-600' : ''}`}
            onClick={() => setActiveTab('quotas')}
          >
            Quotas
          </button> */}
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
          onClick={logout}
        >
          Déconnexion
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        {activeTab === 'commercials' && <CommercialList />}
        {/* {activeTab === 'quotas' && <QuotaList />} */}
        {activeTab === 'prospections' && <ProspectionList />}
        {activeTab === 'permissions' && <PermissionManagement />}
        {activeTab === 'profile' && <ChangePassword />}
      </div>
    </div>
  );
}

export default withAuth(ResponsableDashboard)

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function SplashScreen() {
//   const router = useRouter();
//   const [rotation, setRotation] = useState(0);

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         router.push('/login');
//       } else {
//         // Vérifiez la validité du token ici si nécessaire
//         router.push('/dashboard');
//       }
//     };

//     checkAuth();

//     // Animation de rotation
//     const intervalId = setInterval(() => {
//       setRotation((prevRotation) => (prevRotation + 2) % 360);
//     }, 50);

//     return () => clearInterval(intervalId);
//   }, [router]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-purple-900">
//       <div className="relative w-20 h-20 mb-6">
//         {' '}
//         {/* Cercles concentriques */}
//         <div className="absolute inset-0 border-2 border-purple-300 rounded-full opacity-20"></div>
//         <div className="absolute inset-3 border border-purple-300 rounded-full opacity-40"></div>
//         <div className="absolute inset-6 border border-purple-300 rounded-full opacity-60"></div>
//         {/* Ligne de scan rotative */}
//         <div
//           className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-gradient-to-b from-white to-transparent origin-bottom"
//           style={{ transform: `rotate(${rotation}deg)` }}
//         ></div>
//         {/* Point central */}
//         <div className="absolute inset-0 m-auto w-1 h-1 bg-white rounded-full"></div>
//       </div>

//       <div className="text-white text-2xl font-bold">Prospect</div>
//     </div>
//   );
// }

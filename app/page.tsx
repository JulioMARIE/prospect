'use client';


//Ce code n'utilise pas les getServerProps de Next js.
//C'est un projet vite fait basé sur un modèle simple
//Merci Brendan Eich

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashScreen() {
  const router = useRouter();
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      } else {
        // Vérifiez la validité du token ici si nécessaire
        router.push('/responsable');
      }
    };

    checkAuth();

    // Animation de rotation
    const intervalId = setInterval(() => {
      setRotation((prevRotation) => (prevRotation + 2) % 360);
    }, (5));

    return () => clearInterval(intervalId);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-900">
      <div className="relative w-20 h-20 mb-6">
        {' '}
        {/* Cercles concentriques */}
        <div className="absolute inset-0 border-2 border-purple-300 rounded-full opacity-20"></div>
        <div className="absolute inset-3 border border-purple-300 rounded-full opacity-40"></div>
        <div className="absolute inset-6 border border-purple-300 rounded-full opacity-60"></div>
        {/* Ligne de scan rotative */}
        <div
          className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-gradient-to-b from-white to-transparent origin-bottom"
          style={{ transform: `rotate(${rotation}deg)` }}
        ></div>
        {/* Point central */}
        <div className="absolute inset-0 m-auto w-1 h-1 bg-white rounded-full"></div>
      </div>

      <div className="text-white text-2xl font-bold">Prospect</div>
    </div>
  );
}
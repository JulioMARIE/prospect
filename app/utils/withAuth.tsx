'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const WithAuthComponent = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login');
      }
    }, [router]); // Ajout de router dans le tableau de dépendances

    return <WrappedComponent {...props} />;
  };

  // Ajout du displayName
  WithAuthComponent.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;

  return WithAuthComponent;
};

// Fonction utilitaire pour obtenir le nom d'affichage
function getDisplayName(WrappedComponent: React.ComponentType) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAuth;
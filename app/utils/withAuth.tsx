'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define the type for the wrapped component props
type WrappedComponentProps = {
  [key: string]: any;
};

const withAuth = (WrappedComponent: React.ComponentType<WrappedComponentProps>) => {
  // Add display name for the HOC
  const WithAuthWrapper: React.FC<WrappedComponentProps> = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login');
      }
    }, [router]); // Include router in the dependency array

    return <WrappedComponent {...props} />;
  };

  WithAuthWrapper.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthWrapper;
};

export default withAuth;

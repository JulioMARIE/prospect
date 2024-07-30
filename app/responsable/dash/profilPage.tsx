'use client';

import React, { useEffect, useState } from 'react';
import ChangePassword from './changePassword';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export default function ProfilePage() {
  const [user, setUser] = useState({
    profilePicture: "",
    name: "",
    email: "",
    id: 0
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        profilePicture: "",
        name: `${parsedUser.utilisateur.nom} ${parsedUser.utilisateur.prenom}`,
        email: parsedUser.utilisateur.email,
        id: parsedUser.utilisateur.id
      });
    }
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 flex items-center justify-center bg-indigo-500 rounded-full mb-4">
          <FontAwesomeIcon icon={faUser} size="3x" className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
        <p className="text-gray-600">{user.email}</p>
      </div>

      <ChangePassword user={user} />
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  useRouter().push('/login');
};
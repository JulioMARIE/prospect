'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {useRouter} from 'next/navigation';

const ChangePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Le mot de passe actuel est requis'),
  newPassword: Yup.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
    .matches(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
    .matches(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
    .matches(/[^a-zA-Z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial')
    .required('Le nouveau mot de passe est requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), ""], 'Les mots de passe doivent correspondre')
    .required('La confirmation du mot de passe est requise'),
});

interface ChangePasswordProps {
  user: {
    id: number;
  };
}

export default function ChangePassword({ user }: ChangePasswordProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: ChangePasswordSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await api.post(`/changePassword/${user.id}`, {
          "mot_de_passe_actuel": values.currentPassword,
          "nouveau_mot_de_passe": values.newPassword,
          "nouveau_mot_de_passe_confirme": values.confirmPassword,
        });
        toast.success('Mot de passe changé avec succès!');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          router.push('/login');
      } catch (error) {
        toast.error('Erreur lors du changement de mot de passe');
      } finally {
        setIsLoading(false);
      }
      formik.resetForm();
    },
  });

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Changer le mot de passe</h2>
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        </div>
      )}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
            Mot de passe actuel
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type={showCurrentPassword ? 'text' : 'password'}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.currentPassword}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} />
          </button>
          {formik.touched.currentPassword && formik.errors.currentPassword ? (
            <div className="mt-1 text-sm text-red-600">{formik.errors.currentPassword}</div>
          ) : null}
        </div>

        <div className="relative">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            Nouveau mot de passe
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
          </button>
          {formik.touched.newPassword && formik.errors.newPassword ? (
            <div className="mt-1 text-sm text-red-600">{formik.errors.newPassword}</div>
          ) : null}
        </div>

        <div className="relative">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmer le nouveau mot de passe
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
          </button>
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</div>
          ) : null}
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Changer le mot de passe
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

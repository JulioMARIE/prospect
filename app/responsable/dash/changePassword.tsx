'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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
    .oneOf([Yup.ref('newPassword'), "null"], 'Les mots de passe doivent correspondre')
    .required('La confirmation du mot de passe est requise'),
});

export default function ChangePassword() {
  const [changeSuccess, setChangeSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: ChangePasswordSchema,
    onSubmit: (values) => {
      // Ici, vous ajouteriez la logique pour changer le mot de passe dans votre backend
      console.log('Changement de mot de passe:', values);
      setChangeSuccess(true);
      formik.resetForm();
    },
  });

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Changer le mot de passe</h2>
      {changeSuccess && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          Mot de passe changé avec succès !
        </div>
      )}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
            Mot de passe actuel
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.currentPassword}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.currentPassword && formik.errors.currentPassword ? (
            <div className="mt-1 text-sm text-red-600">{formik.errors.currentPassword}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            Nouveau mot de passe
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.newPassword && formik.errors.newPassword ? (
            <div className="mt-1 text-sm text-red-600">{formik.errors.newPassword}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmer le nouveau mot de passe
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
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
    </div>
  );
}
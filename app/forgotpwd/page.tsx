'use client';

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../utils/api';
import { useRouter } from 'next/navigation';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Adresse email invalide')
    .required('L\'email est requis'),
});

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: ForgotPasswordSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await api.post('/resetPassword', {
          email: values.email,
        });
        toast.success('Instructions envoyées à votre adresse email.');
        formik.resetForm();
        router.replace('/login')
      } catch (error) {
        toast.error('Erreur lors de l\'envoi des instructions.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    // Configurez axios pour inclure le token CSRF dans chaque requête
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
      const csrfToken = metaTag.getAttribute('content');
      if (csrfToken) {
        api.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
      } else {
        console.error('CSRF token not found in meta tag');
      }
    } else {
      console.error('CSRF meta tag not found');
    }
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-600">
          Mot de passe oublié
        </h2>
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`mt-1 block w-full px-3 py-2 border ${
                formik.touched.email && formik.errors.email
                  ? 'border-red-500'
                  : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
              placeholder="Votre email"
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
            ) : null}
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin size="sm" />
              ) : (
                'Envoyer les instructions'
              )}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </main>
  );
};

export default ForgotPassword;

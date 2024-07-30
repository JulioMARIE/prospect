'use client';

import React, { useState } from 'react';
// import Image from 'next/image';
import { FormikHelpers, useFormik } from 'formik';
import { loginSchema } from '../constants/validationSchema';
import { initialValues } from '../utils/formUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { LoginController } from '../login/loginController';
import { useRouter } from 'next/navigation';
import withAuth from '../utils/withAuth';

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const formik = useFormik<LoginFormValues>({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }: FormikHelpers<LoginFormValues>) => {
      const success = await LoginController.handleLogin(values.email, values.password);
      if (success) {
        const user = localStorage.getItem('user');    
    
        router.push('/');
      } else {
        // Gérer l'échec de connexion, par exemple en affichant un message d'erreur
        console.log('Échec de la connexion');
      }
      setSubmitting(false);
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-600">
          Se connecter à votre espace responsable
        </h2>
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...formik.getFieldProps('email')}
              className={`mt-1 block w-full px-3 py-2 border ${
                formik.touched.email && formik.errors.email
                  ? 'border-red-500'
                  : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
              placeholder="Votre email"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                {...formik.getFieldProps('password')}
                className={`mt-1 block w-full px-3 py-2 border ${
                  formik.touched.password && formik.errors.password
                    ? 'border-red-500'
                    : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                placeholder="Votre mot de passe"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {formik.errors.password}
              </p>
            )}
          </div>
          <div className="text-right">
            <a
              href="/admin"
              className="text-sm text-purple-600 hover:text-purple-500"
            >
              Mot de passe oublié?
            </a>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default withAuth(Login)
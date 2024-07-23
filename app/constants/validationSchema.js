import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Adresse email invalide')
    .required('Ce champ est requis'),
  password: Yup.string().min(8, "au moins 8 caractères").required('Ce champ est requis'),
});

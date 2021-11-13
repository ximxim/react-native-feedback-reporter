import * as yup from 'yup';

export const AccountLinkingFormValidation = yup.object().shape({
  username: yup.string().required('Username is required'),
  token: yup.string().required('API token is required'),
});

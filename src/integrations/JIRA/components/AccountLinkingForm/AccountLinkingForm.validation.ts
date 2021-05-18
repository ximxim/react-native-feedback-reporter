import * as yup from 'yup';

export const AccountLinkingFormValidation = yup.object().shape({
  username: yup.string().required(),
  token: yup.string().required(),
});

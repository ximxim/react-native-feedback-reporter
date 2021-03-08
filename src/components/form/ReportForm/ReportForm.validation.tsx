import * as yup from 'yup';

export const ReportFormValidation = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
});

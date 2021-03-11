import * as yup from 'yup';

export const JIRAFormValidation = {
  JIRAProject: yup.string().required('Project is required'),
  JIRAIssueType: yup.string().required('Issue type is required'),
};

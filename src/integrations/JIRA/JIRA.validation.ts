import * as yup from 'yup';

export const JIRAFormValidation = {
  JIRASwitch: yup.boolean(),
  JIRAProject: yup.string().when('JIRASwitch', {
    is: true,
    then: yup.string().required('Project is required'),
  }),
  JIRAIssueType: yup.string().when('JIRASwitch', {
    is: true,
    then: yup.string().required('Issue type is required'),
  }),
};

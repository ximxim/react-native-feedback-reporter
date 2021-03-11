import * as yup from 'yup';

import type { IFeedbackReporterProps } from '../../contexts';
import { JIRAFormValidation } from '../../../integrations';

export const ReportFormValidation = ({ jira }: IFeedbackReporterProps) => {
  const jiraValidation = jira ? JIRAFormValidation : {};

  return yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    ...jiraValidation,
  });
};

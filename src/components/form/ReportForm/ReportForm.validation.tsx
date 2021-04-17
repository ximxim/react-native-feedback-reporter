import * as yup from 'yup';

import type { IFeedbackReporterProps } from '../../contexts';
import { JIRAFormValidation, slackFormValidation } from '../../../integrations';

export const ReportFormValidation = ({
  jira,
  slack,
}: IFeedbackReporterProps) => {
  const jiraValidation = jira ? JIRAFormValidation : {};
  const slackValidation = slack ? slackFormValidation : {};

  return yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    ...jiraValidation,
    ...slackValidation,
  });
};

export const LinkingAccountsValidation = ({ jira }: IFeedbackReporterProps) => {
  const jiraValidation = jira ? JIRAFormValidation : {};

  return yup.object().shape({
    ...jiraValidation,
  });
};

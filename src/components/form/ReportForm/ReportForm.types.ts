import type { ReactNode } from 'react';

import type { JIRAIntegrationValues } from '../../../integrations';

export enum FormOrderEnum {
  Title = 'title',
  Description = 'description',
  JIRAProjects = 'jira_projects',
  JIRAIssueTypes = 'jira_issue_types',
  AdditionalInformation = 'additional_information',
  JIRASwitch = 'jira_switch',
  SlackSwitch = 'slack_switch',
  ScreenShotAndExternalSource = 'screen_shot_and_external_sources',
}

export interface IReportFormSection {
  renderItem: () => ReactNode;
}

export interface IReportFormProps {
  handleClose: () => void;
}

export interface IReportFormValues extends JIRAIntegrationValues {
  uri: string;
  title: string;
  description: string;
}

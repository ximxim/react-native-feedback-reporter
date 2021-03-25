import type { ReactNode } from 'react';
import type { KeyboardAvoidingScrollViewProps } from 'react-native-keyboard-avoiding-scroll-view';

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

export enum SubmissionOrderEnum {
  Reporting = 'reporting',
  Jira = 'jira',
  Slack = 'slack',
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

export interface IScreens extends KeyboardAvoidingScrollViewProps {
  components: Record<string, ReactNode>;
  order: FormOrderEnum[] | SubmissionOrderEnum[];
}

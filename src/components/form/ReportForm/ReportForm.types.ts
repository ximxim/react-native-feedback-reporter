import type { ReactNode } from 'react';
import type { KeyboardAvoidingScrollViewProps } from 'react-native-keyboard-avoiding-scroll-view';

import type {
  JIRAIntegrationValues,
  SlackIntegrationValues,
} from '../../../integrations';

export enum FormOrderEnum {
  Title = 'title',
  Description = 'description',
  Integrations = 'integrations',
  AdditionalInformation = 'additional_information',
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

export interface IReportFormValues
  extends JIRAIntegrationValues,
    SlackIntegrationValues {
  uri: string;
  title: string;
  description: string;
}

export interface IScreens extends Partial<KeyboardAvoidingScrollViewProps> {
  name: 'bugReport' | 'submission';
  components: Record<string, ReactNode>;
  order: FormOrderEnum[] | SubmissionOrderEnum[];
}

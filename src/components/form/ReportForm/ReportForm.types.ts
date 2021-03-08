import type { ReactNode } from 'react';

import type { JIRAIntegrationValues } from '../../../integrations';

export interface IReportFormSection {
  renderItem: () => ReactNode;
}

export interface IReportFormProps {
  sections?: IReportFormSection[];
}

export interface IReportFormValues extends JIRAIntegrationValues {
  uri: string;
  title: string;
  description: string;
}

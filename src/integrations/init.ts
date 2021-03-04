import type { IFeedbackReporterProps } from '../components';

import { setJIRAApiHeaders } from './JIRA';

export const initIntegrations = (props: IFeedbackReporterProps) => {
  if (props.jira) {
    setJIRAApiHeaders(props.jira);
  }
};

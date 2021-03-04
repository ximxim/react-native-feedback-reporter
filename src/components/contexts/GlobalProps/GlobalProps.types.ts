import type { JIRAIntegrationProps } from '../../../integrations';

interface IOptional {
  defaultValue?: string;
  isVisible?: boolean;
}
export interface IFeedbackReporterProps {
  mode?: 'onScreenShot';

  /**
   * Steps to create field props
   */
  descriptionFeild?: IOptional;

  /**
   * Dev notes
   */
  devNotes?: string;

  /**
   * Attachments
   */
  attachments?: [];

  /**
   * JIRA Integration
   */
  jira?: JIRAIntegrationProps;
}

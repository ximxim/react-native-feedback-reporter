import type { ModalProps } from 'react-native';

import type { theme } from '../../../theme';
import type { JIRAIntegrationProps } from '../../../integrations';

export interface IFeedbackReporterProps {
  mode?: 'onScreenShot';

  /**
   * Theme
   */
  theme?: keyof typeof theme | typeof theme.base;

  /**
   * Dev notes
   */
  devNotes?: string;

  /**
   * JIRA Integration
   */
  jira?: JIRAIntegrationProps;

  /**
   * Modal props
   */
  modalProps?: Partial<ModalProps>;
}

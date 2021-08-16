import type { ReactNode } from 'react';
import type { ModalProps, ViewProps } from 'react-native';

import type { theme } from '../../../theme';
import type { IModalHeaderProps } from '../../ui';
import type { FormOrderEnum, IReportFormValues } from '../../form';
import type {
  JIRAIntegrationProps,
  SlackIntegrationProps,
} from '../../../integrations';

export type DevNotesType =
  | string
  | undefined
  | (() => string)
  | (() => Promise<string>);

export interface IFeedbackReporterProps {
  mode?: 'onScreenShot';

  /**
   * Theme
   */
  theme?: keyof typeof theme | typeof theme.base;

  /**
   * Dev notes
   */
  devNotes?: DevNotesType;

  /**
   * JIRA Integration
   */
  jira?: JIRAIntegrationProps;

  /**
   * Slack Integration
   */
  slack?: SlackIntegrationProps;

  /**
   * Modal props
   */
  modalProps?: Partial<ModalProps & { header?: IModalHeaderProps }>;

  /**
   * Additional Information
   */
  additionalInformation?: (values: IReportFormValues) => ReactNode;

  /**
   * Additional screen shot
   */
  extraSource?: 'react-native-image-crop-picker';

  /**
   * Form order
   */
  order?: FormOrderEnum[];

  /**
   * Container view props
   */
  containerViewProps?: ViewProps;
  /**
   * disableBreadrumbs
   */
  disableBreadrumbs?: boolean;
}

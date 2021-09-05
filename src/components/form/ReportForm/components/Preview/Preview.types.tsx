import type { ITabProps } from '../../../../ui';
import type { IImageAttachmentsProps } from '../ImageAttachments';

export interface IPreviewTab extends Partial<ITabProps> {
  name: string;
}

export interface IPreviewProps extends IImageAttachmentsProps {}

import type { ITabProps } from '../../../../ui';
import type { IImageAttachmentsProps } from '../ImageAttachments';
import type { IUploadFile } from '../../../../../utils';

export interface IPreviewTab extends Partial<ITabProps> {
  name: string;
}

export interface IPreviewProps extends IImageAttachmentsProps {
  allFilesToUpload: IUploadFile[];
}

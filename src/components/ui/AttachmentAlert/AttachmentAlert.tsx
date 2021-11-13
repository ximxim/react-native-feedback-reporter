import React from 'react';

import type { IAttachmentAlertProps } from './AttachmentAlert.types';

import { Alert } from '../Alert';

export const AttachmentAlert = ({ isAttaching }: IAttachmentAlertProps) => {
  return (
    <Alert
      isLoading={isAttaching}
      alert={isAttaching ? 'Uploading attachments.' : 'Attachments uploaded'}
    />
  );
};

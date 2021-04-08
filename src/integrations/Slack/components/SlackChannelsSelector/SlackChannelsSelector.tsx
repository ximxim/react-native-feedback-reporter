import React, { FunctionComponent } from 'react';
import { useFormContext } from 'react-hook-form';

import type { ISlackChannelsSelectorProps } from './SlackChannelsSelector.types';

import { DropListPicker, IReportFormValues } from '../../../../components';

export const SlackChannelsSelector: FunctionComponent<ISlackChannelsSelectorProps> = ({
  options,
  ...dropListPickerProps
}) => {
  const { setValue, watch, errors } = useFormContext<IReportFormValues>();

  return (
    <DropListPicker
      {...dropListPickerProps}
      label="Channel"
      options={options || []}
      defaultValue={watch('slackChannel')}
      onChange={(val) => setValue('slackChannel', val)}
      error={errors.slackChannel?.message}
    />
  );
};

import { useEffect, useContext } from 'react';
import { useQuery } from 'react-query';
import { useFormContext } from 'react-hook-form';

import { compare } from '../../../utils';
import { getSlackChannels } from '../queries';
import { IReportFormValues, IOption, GlobalProps } from '../../../components';
import { slackApi } from '../slackApi.service';

export const useSlackChannels = () => {
  const { slack } = useContext(GlobalProps);
  const { data, isLoading } = useQuery('SlackChannels', getSlackChannels, {
    enabled: !!slack && !!slackApi.defaults.headers.common.Authorization,
  });
  const {
    setValue,
    register,
    unregister,
  } = useFormContext<IReportFormValues>();
  const channels = data?.data.channels || [];

  useEffect(() => {
    if (!slack) return;

    register('slackChannel');

    return () => {
      unregister(['slackChannel']);
    };
  }, [register]);

  useEffect(() => {
    if (!slack) return;

    const val = slack?.channel || '';
    const found = channels.find(
      (channel) =>
        compare(channel.name, val) || compare(channel.name_normalized, val)
    );
    setValue('slackChannel', found?.name_normalized);
  }, [isLoading]);

  const options: IOption[] = channels.map((channel) => ({
    key: channel.name_normalized,
    value: `# ${channel.name}`,
  }));

  if (isLoading) return [];

  return options;
};

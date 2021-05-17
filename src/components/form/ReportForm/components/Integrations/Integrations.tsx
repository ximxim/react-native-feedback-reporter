import { FlatList } from 'react-native';
import React, { FunctionComponent, useContext } from 'react';

import { IntegrationsEnum, IIntegrationsProps } from './Integrations.types';

import { Typography } from '../../../../ui';
import { GlobalProps } from '../../../../contexts';
import { useNavigation } from '../../../../../hooks';

export const Integrations: FunctionComponent<IIntegrationsProps> = ({
  components,
  enabledIntegrationsCount,
}) => {
  const { jira, slack } = useContext(GlobalProps);
  const data: IntegrationsEnum[] = [
    IntegrationsEnum.JIRA,
    IntegrationsEnum.Slack,
  ].filter((d) => {
    return (
      (jira && d === IntegrationsEnum.JIRA) ||
      (slack && d === IntegrationsEnum.Slack)
    );
  });
  const integrationComponents = data.map((integration) => ({
    component: components[integration],
  }));

  const { Navigation, setPageNumber } = useNavigation(
    { data: integrationComponents },
    [enabledIntegrationsCount]
  );

  return (
    <>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Typography px={10} variant="h1" onPress={() => setPageNumber(index)}>
            {item}
          </Typography>
        )}
      />
      {Navigation}
    </>
  );
};

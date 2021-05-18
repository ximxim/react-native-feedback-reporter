import { FlatList } from 'react-native';
import React, { FunctionComponent, useContext } from 'react';

import { IntegrationsEnum, IIntegrationsProps } from './Integrations.types';

import { Tab, Box } from '../../../../ui';
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

  const { Navigation, setPageNumber, pageNumber } = useNavigation(
    { data: integrationComponents },
    [enabledIntegrationsCount]
  );

  return (
    <>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 8 }}
        renderItem={({ item, index }) => (
          <Tab
            label={item}
            isSelected={index === pageNumber}
            onPress={() => setPageNumber(index)}
          />
        )}
      />
      <Box mt={2} />
      {Navigation}
    </>
  );
};

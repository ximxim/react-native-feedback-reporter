import { FlatList, StyleSheet } from 'react-native';
import React, { FunctionComponent, useContext } from 'react';

import {
  IIntegrationTab,
  IntegrationsEnum,
  IIntegrationsProps,
} from './Integrations.types';

import { Tab, Box } from '../../../../ui';
import { GlobalProps } from '../../../../contexts';
import { useNavigation } from '../../../../../hooks';

export const Integrations: FunctionComponent<IIntegrationsProps> = ({
  components,
  enabledIntegrationsCount,
}) => {
  const { jira, slack, hideAttachments } = useContext(GlobalProps);
  const data: IIntegrationTab[] = [
    { name: IntegrationsEnum.Attachments },
    { name: IntegrationsEnum.JIRA },
    { name: IntegrationsEnum.Slack },
  ].filter((d) => {
    return (
      (jira && d.name === IntegrationsEnum.JIRA) ||
      (slack && d.name === IntegrationsEnum.Slack) ||
      (!hideAttachments && d.name === IntegrationsEnum.Attachments)
    );
  });
  const integrationComponents = data.map((integration) => ({
    component: components[integration.name],
  }));

  const { Navigation, setPageNumber, pageNumber } = useNavigation(
    { data: integrationComponents },
    [enabledIntegrationsCount, hideAttachments]
  );

  return (
    <>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.contentContainerStyle}
        renderItem={({ item: { name, ...tabProps }, index }) => (
          <Tab
            label={name}
            isSelected={index === pageNumber}
            onPress={() => setPageNumber(index)}
            {...tabProps}
          />
        )}
      />
      <Box mt={2} />
      {Navigation}
    </>
  );
};

const style = StyleSheet.create({
  contentContainerStyle: {
    paddingLeft: 8,
  },
});

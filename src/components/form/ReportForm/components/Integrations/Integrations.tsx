import React, {
  FunctionComponent,
  useContext,
  useRef,
  useState,
  useEffect,
  createRef,
  RefObject,
} from 'react';
import { FlatList, Dimensions, View, LayoutAnimation } from 'react-native';

import { IntegrationsEnum, IIntegrationsProps } from './Integrations.types';

import { Typography } from '../../../../ui';
import { GlobalProps } from '../../../../contexts';

const { width } = Dimensions.get('screen');

export const Integrations: FunctionComponent<IIntegrationsProps> = ({
  components,
  enabledIntegrationsCount,
}) => {
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [height, setHeight] = useState<number>();
  const flatListRef = useRef<FlatList>(null);
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
  const elRefs = React.useRef<RefObject<View>[]>(data.map(() => createRef()))
    .current;

  const integrationComponents = data.map((integration) => ({
    component: components[integration],
  }));

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [height]);

  useEffect(() => {
    elRefs[pageNumber].current?.measure((_x, _y, _width, elHeight) => {
      if (elHeight <= 0) return;
      setHeight(elHeight);
    });
  });

  useEffect(() => {
    flatListRef.current?.scrollToIndex({ index: pageNumber, animated: true });
  }, [enabledIntegrationsCount, pageNumber]);

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
      <FlatList
        horizontal
        pagingEnabled
        ref={flatListRef}
        style={{ height }}
        scrollEnabled={false}
        data={integrationComponents}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item: { component }, index }) => (
          <View style={{ width }}>{component(elRefs[index])}</View>
        )}
      />
    </>
  );
};

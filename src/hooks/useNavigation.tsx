import React, {
  useRef,
  useState,
  RefObject,
  useEffect,
  createRef,
  DependencyList,
} from 'react';
import { FlatList, View, Dimensions, LayoutAnimation } from 'react-native';

const { width } = Dimensions.get('screen');

export type NavigationElementType = (ref: any) => JSX.Element;

interface IData {
  component: NavigationElementType;
}

export interface IUseNavigationProps {
  data: IData[];
}

export const useNavigation = (
  { data }: IUseNavigationProps,
  dependancyList: DependencyList
) => {
  const [pageNumber, setPageNumber] = useState<number>(0);
  const flatListRef = useRef<FlatList>(null);
  const [height, setHeight] = useState<number>();
  const elRefs = useRef<RefObject<View>[]>(data.map(() => createRef())).current;

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
  }, [pageNumber, ...dependancyList]);

  const Navigation = (
    <FlatList
      horizontal
      pagingEnabled
      ref={flatListRef}
      style={{ height }}
      scrollEnabled={false}
      data={data}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item: { component }, index }) => (
        <View style={{ width }}>{component(elRefs[index])}</View>
      )}
    />
  );
  return {
    Navigation,
    setPageNumber,
  };
};

import React, {
  useRef,
  useState,
  RefObject,
  useEffect,
  createRef,
  DependencyList,
} from 'react';
import { ScrollView, View, Dimensions, LayoutAnimation } from 'react-native';

const { width } = Dimensions.get('screen');

export type NavigationElementType = (
  ref: RefObject<View>,
  setPageNumber: (index: number) => void
) => JSX.Element;

interface IData {
  component: NavigationElementType;
}

export interface IUseNavigationProps {
  data: IData[];
}

export const useNavigation = (
  { data }: IUseNavigationProps,
  dependancyList: DependencyList = []
) => {
  const [pageNumber, setPageNumber] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);
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
    scrollViewRef.current?.scrollTo({
      x: width * pageNumber,
      animated: true,
    });
  }, [pageNumber, ...dependancyList]);

  const Navigation = (
    <ScrollView
      horizontal
      pagingEnabled
      ref={scrollViewRef}
      style={{ height }}
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
    >
      {data?.map(({ component }, index) => (
        <View style={{ width }}>{component(elRefs[index], setPageNumber)}</View>
      ))}
    </ScrollView>
  );
  return {
    Navigation,
    setPageNumber,
  };
};

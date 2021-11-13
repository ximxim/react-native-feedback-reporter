import React, {
  useRef,
  useState,
  RefObject,
  useEffect,
  createRef,
  useCallback,
  DependencyList,
} from 'react';
import { ScrollView, View, Dimensions, LayoutAnimation } from 'react-native';

const { width } = Dimensions.get('screen');

export type NavigationElementType = (
  ref: RefObject<View>,
  setPageNumber: (index: number) => void,
  updateNavigationView: () => void
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
  const [counter, setCounter] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [height, setHeight] = useState<number>();
  const elRefs = useRef<RefObject<View>[]>(data.map(() => createRef()));

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [height]);

  useEffect(() => {
    if (data.length === elRefs.current.length) return;
    data.slice(elRefs.current.length).map(() => {
      elRefs.current.push(createRef());
    });
  }, [data]);

  useEffect(() => {
    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));

      elRefs.current[pageNumber].current?.measureLayout(
        // @ts-ignore: ref typescript is weird and old so ignoring it
        scrollViewRef.current,
        (_left, _top, _width, elHeight) => {
          if (elHeight <= 0 || elHeight === height) return;
          setHeight(elHeight);
        },
        console.log
      );
    })();
  });

  const updateNavigationView = useCallback(() => setCounter(counter + 1), [
    counter,
  ]);

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
      contentContainerStyle={{
        height: (height || 0) + 40,
      }}
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
    >
      {data?.map(({ component }, index) => (
        <View style={{ width }}>
          {component(
            elRefs.current[index],
            setPageNumber,
            updateNavigationView
          )}
        </View>
      ))}
    </ScrollView>
  );
  return {
    Navigation,
    pageNumber,
    setPageNumber,
  };
};

import React, {
  createContext,
  FunctionComponent,
  useRef,
  useState,
  useEffect,
} from 'react';
import {
  View,
  Animated,
  Dimensions,
  LayoutChangeEvent,
  GestureResponderEvent,
} from 'react-native';
import _ from 'lodash';

import { popoverAnimation, childrenAnimation } from './Popover.animation';
import * as Styled from './Popover.styles';

import type {
  anchorType,
  IModalToggleProps,
  IPopoverState,
  IPopoverContext,
  IOpenPopoverParams,
  IPopoverProviderProps,
} from './Popover.types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

export const PopoverContext = createContext<IPopoverContext>({
  openPopover: () => {},
});

const initialPopoverParams: IPopoverState = {
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  component: null,
  anchor: 'top-left',
};

export const Popover: FunctionComponent<IPopoverProviderProps> = ({
  children,
}) => {
  const [popoverParams, setPopoverParams] = useState<IPopoverState>(
    initialPopoverParams
  );
  const [bubbleHeight, setBubbleHeight] = useState<number>(0);
  const [bubbleWidth, setBubbleWidth] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const bubbleRef = useRef<View>(null);
  const bubbleTranslateY = useRef(new Animated.Value(30)).current;
  const bubbleOpacity = useRef(new Animated.Value(0)).current;
  const scaleXY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const handleToggleModal = async (params?: IModalToggleProps) => {
    if (!isModalOpen) setIsModalOpen(true);

    const fullSequence = [
      popoverAnimation(
        bubbleTranslateY,
        bubbleOpacity,
        isModalOpen,
        popoverParams.anchor
      ),
      childrenAnimation(scaleXY, opacity, isModalOpen),
    ];
    if (isModalOpen) {
      fullSequence.reverse();
      await popoverParams?.onDismissAsync?.(isModalOpen);
    }

    Animated.sequence(fullSequence).start(() => {
      if (isModalOpen) {
        setIsModalOpen(false);
      } else {
        params?.onShow?.(isModalOpen);
      }
    });
  };

  useEffect(() => {
    if (time) return;

    const timer = setTimeout(() => {
      if (isModalOpen) {
        handleToggleModal();
      }
      setTime(0);
    }, time);

    return () => clearTimeout(timer);
  }, [time]);

  const openPopover = _.throttle(
    ({
      ref,
      anchor,
      timeout,
      onShow,
      bubbleWidth: customBubbleWidth,
      ...others
    }: IOpenPopoverParams): void => {
      // @ts-ignore: todo
      ref?.current?.measure((_x, _y, width, height, left, top) => {
        if (isModalOpen) return;

        const xThreshold = screenWidth / 2;
        const yThreshold = screenHeight - 350;
        const xAnchor = top < yThreshold ? 'bottom' : 'top';
        const yAnchor = left < xThreshold ? 'left' : 'right';
        const calcAnchor = anchor || (`${xAnchor}-${yAnchor}` as anchorType);

        setBubbleWidth(customBubbleWidth || Styled.defaultBubbleWidth);

        setPopoverParams({
          width,
          height,
          left,
          top,
          anchor: calcAnchor,
          ...others,
        });

        handleToggleModal({ onShow });

        if (timeout) {
          setTime(timeout);
        }
      });
    },
    150
  );

  const stylePayload = { ...popoverParams, bubbleHeight, bubbleWidth };
  const handleStartShouldSetResponderCapture = (
    event: GestureResponderEvent
  ) => {
    event.persist();

    // Don't dismiss if user taps on message bubble
    // --------------------------v------- Bubble Wrapper ------v--- Bubble --v-- Message --v
    const messageCompNativeTag =
      // @ts-ignore: hacky
      bubbleRef?.current?._component?._children[0]?._children[0]?._nativeTag;

    if (event.target === messageCompNativeTag) {
      return true;
    }

    // Dismiss if the user taps anywhere outside of the message bubble
    if (isModalOpen) {
      handleToggleModal();
    }
    return false;
  };

  return (
    <PopoverContext.Provider value={{ openPopover }}>
      <View
        onStartShouldSetResponderCapture={handleStartShouldSetResponderCapture}
        style={{ height: screenHeight, width: screenWidth }}
      >
        {children}
        <Styled.BubbleWrapper
          {...stylePayload}
          style={{
            transform: [{ translateY: bubbleTranslateY }],
            opacity: bubbleOpacity,
          }}
          ref={bubbleRef}
        >
          {isModalOpen && (
            <Styled.Bubble
              {...stylePayload}
              onLayout={({ nativeEvent }: LayoutChangeEvent) =>
                setBubbleHeight(nativeEvent.layout.height)
              }
            >
              {popoverParams.component}
            </Styled.Bubble>
          )}
          <Styled.Triangle {...stylePayload} />
        </Styled.BubbleWrapper>
      </View>
    </PopoverContext.Provider>
  );
};

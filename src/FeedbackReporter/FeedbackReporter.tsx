import { View, NativeModules, Dimensions, Platform } from 'react-native';
import React, { FunctionComponent, useRef, useState } from 'react';

import { Wrapper } from './FeedbackReporter.style';

import { useAuthState, useModalHeaderLeftState } from '../hooks';
import { IFeedbackReporterProps, GlobalProps } from '../components';
import { FeedbackReporterModal } from '../FeedbackReporterModal';

const module = NativeModules.FeedbackReporter;
const captureRef = module.captureRef;
const { scale } = Dimensions.get('screen');

export const FeedbackReporter: FunctionComponent<IFeedbackReporterProps> = ({
  children,
  mode = 'onScreenShot',
  ...props
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const viewRef = useRef<View>(null);
  const authState = useAuthState();
  const modalHeaderLeftState = useModalHeaderLeftState();

  return (
    <Wrapper
      collapsable={false}
      ref={viewRef}
      onTouchStart={async ({ nativeEvent }) => {
        if (props.disableBreadrumbs || !viewRef || isModalOpen) return;

        try {
          // @ts-ignore: _nativeTag causes ts error
          await captureRef(viewRef.current._nativeTag, {
            x: Platform.select({
              android: nativeEvent.pageX * scale,
              default: nativeEvent.pageX,
            }),
            y: Platform.select({
              android: nativeEvent.pageY * scale,
              default: nativeEvent.pageY,
            }),
          });
        } catch (error) {
          console.log(error.message);
        }
      }}
      {...props.containerViewProps}
    >
      {children}
      <GlobalProps.Provider
        value={{
          mode,
          isModalOpen,
          setIsModalOpen,
          ...props,
          ...authState,
          ...modalHeaderLeftState,
        }}
      >
        <FeedbackReporterModal />
      </GlobalProps.Provider>
    </Wrapper>
  );
};

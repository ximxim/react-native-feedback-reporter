import React, { forwardRef, PropsWithChildren, PropsWithoutRef } from 'react';
import { View, ViewProps } from 'react-native';
import styled, { css } from 'styled-components/native';
import {
  alignItems,
  backgroundColor,
  border,
  borderBottom,
  color,
  display,
  flex,
  flexDirection,
  flexWrap,
  height,
  justifyContent,
  minHeight,
  minWidth,
  maxHeight,
  maxWidth,
  position,
  space,
  width,
  AlignItemsProps,
  AlignSelfProps,
  BackgroundColorProps,
  BorderProps,
  ColorProps,
  DisplayProps,
  FlexProps,
  FlexDirectionProps,
  FlexWrapProps,
  HeightProps,
  JustifyContentProps,
  SpaceProps,
  WidthProps,
  overflow,
  OverflowProps,
  PositionProps,
  MinHeightProps,
  MinWidthProps,
  MaxHeightProps,
  MaxWidthProps,
} from 'styled-system';

type Props = AlignItemsProps &
  AlignSelfProps &
  PositionProps &
  BackgroundColorProps &
  BorderProps &
  ColorProps &
  DisplayProps &
  FlexProps &
  FlexDirectionProps &
  FlexWrapProps &
  HeightProps &
  JustifyContentProps &
  OverflowProps &
  SpaceProps &
  WidthProps &
  MinHeightProps &
  MinWidthProps &
  MaxHeightProps &
  MaxWidthProps;

export interface IContainerProps
  extends PropsWithChildren<Props & PropsWithoutRef<ViewProps>> {}

export const StyledContainerCss = css`
  ${alignItems}
  ${backgroundColor}
  ${border}
  ${borderBottom}
  ${color}
  ${display}
  ${flex}
  ${flexWrap}
  ${flexDirection}
  ${flexWrap}
  ${height}
  ${position}
  ${justifyContent}
  ${overflow}
  ${space}
  ${width}
  ${minHeight}
  ${minWidth}
  ${maxHeight}
  ${maxWidth}
`;

const Wrapper = styled(View)`
  flex: 1;
  ${StyledContainerCss}
`;

export const Container = forwardRef<View, IContainerProps>(
  ({ children, ...viewProps }, ref) => (
    <Wrapper {...viewProps} ref={ref}>
      {children}
    </Wrapper>
  )
);

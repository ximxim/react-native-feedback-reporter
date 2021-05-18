import React, { forwardRef, PropsWithoutRef, PropsWithChildren } from 'react';
import type { ViewProps, View } from 'react-native';
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
import type { theme } from '../../../theme';

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

type ColorNames = keyof typeof theme.base.colors;
export type BoxPrefillProps = {
  color?: ColorNames;
  bg?: ColorNames;
  backgroundColor?: ColorNames;
  borderColor?: ColorNames;
};

export type BoxProps = PropsWithChildren<
  Props & PropsWithoutRef<ViewProps> & BoxPrefillProps
>;

export const StyledBoxCss = css`
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

export const StyledBox = styled.View<Props>`
  ${StyledBoxCss}
`;

export const Box = forwardRef<View, BoxProps>(({ ...rest }, ref) => {
  return <StyledBox ref={ref} {...rest} />;
});

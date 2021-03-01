import React, { forwardRef, PropsWithChildren, PropsWithoutRef } from 'react';
import { TextProps, Text } from 'react-native';
import styled from 'styled-components/native';
import {
  variant,
  color as colorProps,
  padding,
  textAlign as textAlignProps,
  FontSizeProps,
  PaddingProps,
  TextAlignProps,
  MarginProps,
  margin,
  BackgroundColorProps,
  backgroundColor,
  BorderRadiusProps,
  borderRadius,
  BorderProps,
  borders,
  OverflowProps,
  overflow,
  FontStyleProps,
  fontStyle,
  TypographyProps,
  typography,
  WidthProps,
  width,
  opacity,
  OpacityProps,
} from 'styled-system';
import type { theme } from '../../../theme';

const textVariants = variant({
  scale: 'textVariants',
});

type TextDecorations = 'underline' | 'line-through';

type Props = {
  variant?: keyof typeof theme.base.textVariants;
  textDecoration?: TextDecorations;
  color?: keyof typeof theme.base.colors;
  hasError?: boolean;
  isFocused?: boolean;
} & PaddingProps &
  FontSizeProps &
  MarginProps &
  TextAlignProps &
  BackgroundColorProps &
  BorderRadiusProps &
  BorderProps &
  FontStyleProps &
  TypographyProps &
  OverflowProps &
  OpacityProps &
  WidthProps;

const StyledTypography = styled(Text)<Props>`
  color: ${({ theme }) => theme.colors.brandSecondary};
  ${textVariants}
  ${colorProps}
  ${padding}
  ${margin}
  ${textAlignProps}
  ${backgroundColor}
  ${borderRadius}
  ${borders}
  ${overflow}
  ${fontStyle}
  ${typography}
  ${width}
  ${opacity}
  opacity: ${({ isFocused, hasError }) => {
    if (isFocused === undefined) return 1;
    return isFocused || hasError ? 1 : 0.8;
  }};
  color: ${({ theme, hasError, color }) => {
    return hasError
      ? theme.colors.brandDanger
      : color || theme.colors.brandSecondary;
  }};
  ${({ theme, color }) => color && `color: ${theme.colors[color]}`};
  ${({ textDecoration, theme, color }) =>
    textDecoration &&
    `text-decoration: ${textDecoration} ${String(
      theme.colors[color || 'brandSecondary'] || ''
    )}`};
`;

export type ITypographyProps = PropsWithChildren<
  Props & PropsWithoutRef<TextProps>
>;

export const Typography = forwardRef<Text, ITypographyProps>(
  ({ children, ...textProps }, ref) => (
    <StyledTypography {...textProps} ref={ref}>
      {children}
    </StyledTypography>
  )
);

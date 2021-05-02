import styled, { css } from 'styled-components/native';
import { Animated } from 'react-native';
import { lighten } from 'polished';

import type { IPopoverStylePayload } from './Popover.types';

export const defaultBubbleWidth = 220;
const bubbleShadowBlur = '12px';
const bubbleShadowColor = 'rgba(0, 0, 0, 0.12)';
const ArrowSize = 15;

export const BubbleWrapper = styled(Animated.View)<IPopoverStylePayload>`
  flex: 1;
  width: ${({ bubbleWidth, component }) =>
    component ? '100%' : `${bubbleWidth || defaultBubbleWidth}px`};
  align-items: stretch;
  position: absolute;
  height: auto;
  ${({ anchor, top, left, width, height, bubbleHeight, bubbleWidth }) => {
    const calcWidth = bubbleWidth || defaultBubbleWidth;
    switch (anchor) {
      case 'top-left':
        return css`
          top: ${top - bubbleHeight}px;
          flex-direction: row;
          left: ${left + width / 2}px;
        `;
      case 'top-right':
        return css`
          top: ${top - bubbleHeight}px;
          flex-direction: row-reverse;
          left: ${left - calcWidth + width / 2}px;
        `;
      case 'top-center':
        return css`
          top: ${top - bubbleHeight / 1.5}px;
          flex-direction: row;
          left: ${left - calcWidth / 4}px;
        `;
      case 'bottom-right':
        return css`
          top: ${top + height}px;
          flex-direction: row-reverse;
          left: ${left - calcWidth + width / 2}px;
        `;
      case 'bottom-left':
        return css`
          top: ${top + height}px;
          flex-direction: row;
          left: ${left + width / 2}px;
        `;
      default:
        return css``;
    }
  }};
`;

export const Bubble = styled.View<IPopoverStylePayload>`
  ${({ component }) =>
    !component
      ? `
    flex: 1;
    padding: 20px;
  `
      : 'width: auto;'};
  elevation: 12;
  box-shadow: 1px 2px ${bubbleShadowBlur} ${bubbleShadowColor};
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  height: auto;
  background-color: ${({ theme }) =>
    lighten(theme.colors.lightenLevels.lvl3, theme.colors.brandPrimary)};
  border-radius: ${({ bubbleHeight }) => bubbleHeight / 2}px;
  ${({ anchor }) => {
    switch (anchor) {
      case 'top-left':
        return css`
          left: -35px;
          top: -${ArrowSize}px;
        `;
      case 'top-right':
        return css`
          left: 35px;
          top: -${ArrowSize}px;
        `;
      case 'top-center':
        return css`
          left: 0px;
          top: -${ArrowSize}px;
        `;
      case 'bottom-right':
        return css`
          left: 35px;
          top: ${ArrowSize}px;
        `;
      case 'bottom-left':
        return css`
          left: -35px;
          top: ${ArrowSize}px;
        `;
      default:
        return css``;
    }
  }};
`;

export const Triangle = styled.View<IPopoverStylePayload>`
  ${({ anchor, bubbleHeight, theme }) => {
    switch (anchor) {
      case 'top-left':
        return css`
          left: -${ArrowSize / 2}px;
          top: ${bubbleHeight - ArrowSize}px;
          border-top-width: ${ArrowSize}px;
          border-top-color: ${lighten(
            theme.colors.lightenLevels.lvl3,
            theme.colors.brandPrimary
          )}};
          border-right-width: ${ArrowSize}px;
          border-right-color: ${theme.colors.transparent};
          border-bottom-width: 0px;
          border-bottom-color: ${theme.colors.transparent};
          border-left-width: 0px;
          border-left-color: ${theme.colors.transparent};
        `;
      case 'top-right':
        return css`
          left: ${ArrowSize / 2}px;
          top: ${bubbleHeight - ArrowSize}px;
          border-top-width: 0px;
          border-top-color: ${theme.colors.transparent};
          border-right-width: ${ArrowSize}px;
          border-right-color: ${lighten(
            theme.colors.lightenLevels.lvl3,
            theme.colors.brandPrimary
          )};
          border-bottom-width: ${ArrowSize}px;
          border-bottom-color: ${theme.colors.transparent};
          border-left-width: 0px;
          border-left-color: ${theme.colors.transparent};
        `;
      case 'top-center':
        return css`
          left: 0px;
          top: 0px;
          border-top-width: 0px;
          border-top-color: ${theme.colors.transparent};
          border-right-width: 0px;
          border-right-color: ${lighten(
            theme.colors.lightenLevels.lvl3,
            theme.colors.brandPrimary
          )};
          border-bottom-width: 0px;
          border-bottom-color: ${theme.colors.transparent};
          border-left-width: 0px;
          border-left-color: ${theme.colors.transparent};
        `;
      case 'bottom-right':
        return css`
          left: ${ArrowSize / 2}px;
          top: 0px;
          border-top-width: 0px;
          border-top-color: ${theme.colors.transparent};
          border-right-width: 0px;
          border-right-color: ${theme.colors.transparent};
          border-bottom-width: ${ArrowSize}px;
          border-bottom-color: ${lighten(
            theme.colors.lightenLevels.lvl3,
            theme.colors.brandPrimary
          )};
          border-left-width: ${ArrowSize}px;
          border-left-color: ${theme.colors.transparent};
        `;
      case 'bottom-left':
        return css`
          left: -${ArrowSize / 2}px;
          top: 0px;
          border-top-width: ${ArrowSize}px;
          border-top-color: ${theme.colors.transparent};
          border-right-width: 0px;
          border-right-color: ${theme.colors.transparent};
          border-bottom-width: 0px;
          border-bottom-color: ${theme.colors.transparent};
          border-left-width: ${ArrowSize}px;
          border-left-color: ${lighten(
            theme.colors.lightenLevels.lvl3,
            theme.colors.brandPrimary
          )};
        `;
      default:
        return css``;
    }
  }};
  border-top-width: ${ArrowSize / 2}px;
  border-top-color: ${({ theme }) =>
    lighten(theme.colors.lightenLevels.lvl3, theme.colors.brandPrimary)};
  border-right-width: ${ArrowSize / 2}px;
  border-right-color: ${({ theme }) => theme.colors.transparent};
  border-bottom-width: 0px;
  border-bottom-color: ${({ theme }) => theme.colors.transparent};
  border-left-width: ${ArrowSize / 2}px;
  border-left-color: ${({ theme }) => theme.colors.transparent};
  width: 0;
  height: 0;
  position: absolute;
  elevation: 12;
`;

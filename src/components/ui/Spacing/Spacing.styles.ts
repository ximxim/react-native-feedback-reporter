import styled from 'styled-components/native';
import { View } from 'react-native';

import type { ISpacingStyleProps } from './Spacing.types';

export const Wrapper = styled(View)<ISpacingStyleProps>`
  margin: ${({ margin, isHorizontal }) => (isHorizontal ? 0 : margin || 0)}px
    ${({ margin, isVertical }) => (isVertical ? 0 : margin || 0)}px;
  padding: ${({ padding, isHorizontal }) => (isHorizontal ? 0 : padding || 0)}px
    ${({ padding, isVertical }) => (isVertical ? 0 : padding || 0)}px;
`;

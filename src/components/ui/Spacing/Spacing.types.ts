import type { ViewProps } from 'react-native';

export interface ISpacingProps extends ViewProps {
  padding?: number;
  margin?: number;
  isHorizontal?: boolean;
  isVertical?: boolean;
}

export interface ISpacingStyleProps extends ISpacingProps {}

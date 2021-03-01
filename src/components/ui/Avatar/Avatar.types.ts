import type { ViewProps } from 'react-native';

export interface IAvatarProps extends ViewProps {
  size?: number;
  uri?: string;
  username: string;
}

export interface IWrapperProps {
  size: number;
}

import type { ImageProps } from 'react-native';

export interface IScreenshotPreviewProps extends Partial<ImageProps> {
  uri: string;
}

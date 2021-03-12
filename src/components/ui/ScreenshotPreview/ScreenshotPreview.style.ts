import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

import { metrics } from '../../../utils';

const { width, height } = Dimensions.get('window');

const calcWidth = width * metrics.screenShotPreview;
const calcHeight = height * metrics.screenShotPreview;

export const Wrapper = styled.View`
  align-self: center;
  width: ${calcWidth}px;
  height: ${calcHeight}px;
`;

export const Image = styled.Image`
  border-radius: 4px;
  border-width: 0.5px;
  align-self: center;
  height: ${calcHeight - metrics.margin * 2}px;
  width: ${calcWidth - metrics.margin * 2}px;
  border-color: ${({ theme }) => theme.colors.brandSecondary};
`;

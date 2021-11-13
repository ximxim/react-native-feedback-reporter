import styled from 'styled-components/native';
import { Dimensions, FlatList as RNFlatList } from 'react-native';

import { metrics } from '../../../utils';

const { width, height } = Dimensions.get('window');

const calcWidth = width * metrics.screenShotPreview;
const calcHeight = height * metrics.screenShotPreview;

export const Wrapper = styled.View`
  align-self: center;
  width: ${calcWidth}px;
  height: ${calcHeight}px;
`;

export const Image = styled.Image<RNFRThemeType>`
  align-self: center;
  border-radius: 4px;
  border-width: 0.5px;
  height: ${calcHeight - metrics.margin * 2}px;
  width: ${calcWidth - metrics.margin * 2}px;
  border-color: ${({ theme }) => theme.colors.brandSecondary};
`;

export const ListItem = styled.View`
  width: ${width - 16}px;
`;

export const FlatList = (styled.FlatList<RNFRThemeType>`
  align-self: center;
  height: ${calcHeight - metrics.margin * 2}px;
  width: ${width - 16}px;
` as unknown) as typeof RNFlatList;

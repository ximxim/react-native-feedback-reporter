import { Dimensions } from 'react-native';
import styled from 'styled-components';
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view';

const { width } = Dimensions.get('window');

export const Wrapper = styled(KeyboardAvoidingScrollView).attrs({
  containerStyle: {
    flex: 1,
    width,
  },
})``;

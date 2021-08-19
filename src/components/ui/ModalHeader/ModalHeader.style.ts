import styled from 'styled-components/native';

export const ModalHeader = styled.View<RNFRThemeType>`
  flex-direction: row;
  border-bottom-width: 2px;
  justify-content: space-between;
  border-color: ${({ theme }) => theme.colors.brandSecondary};
`;

export const Close = styled.TouchableOpacity`
  flex: 1;
  padding: 16px 8px;
`;

export const ModalHeading = styled.View`
  flex: 3;
  padding: 16px 8px;
`;

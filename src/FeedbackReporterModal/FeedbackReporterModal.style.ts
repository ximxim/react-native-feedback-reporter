import styled from 'styled-components/native';

export const Wrapper = styled.SafeAreaView<RNFRThemeType>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.brandPrimary};
`;

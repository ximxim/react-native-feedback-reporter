import styled from 'styled-components/native';

export const ModalHeader = styled.View`
  flex-direction: row;
  border-bottom-width: 2px;
  justify-content: space-between;
  border-color: ${({ theme }) => theme.colors.brandSecondary};
`;

export const Close = styled.Text`
  flex: 1;
  font-size: 14px;
  padding: 16px 8px;
  color: ${({ theme }) => theme.colors.brandSecondary};
`;

export const ModalHeading = styled.Text`
  flex: 8;
  padding: 16px 8px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: ${({ theme }) => theme.colors.brandSecondary};
`;

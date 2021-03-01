import React from 'react';

import * as Styled from './Avatar.style';
import type { IAvatarProps } from './Avatar.types';

export const Avatar = ({
  size = 60,
  username,
  uri,
  ...viewProps
}: IAvatarProps) => {
  return (
    <Styled.Wrapper {...{ ...viewProps, size }}>
      {uri ? (
        <Styled.Image size={size} source={{ uri }} />
      ) : (
        <Styled.Initials size={size}>
          {username.toUpperCase().charAt(0)}
        </Styled.Initials>
      )}
    </Styled.Wrapper>
  );
};

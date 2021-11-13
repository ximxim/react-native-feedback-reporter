import React, { FunctionComponent, useState, useCallback, useRef } from 'react';
import { TouchableOpacity, FlatList } from 'react-native';

import { Box } from '../Box';
import { Typography } from '../Typography';

import * as Styled from './ScreenshotPreview.style';
import type { IScreenshotPreviewProps } from './ScreenshotPreview.types';

export const ScreenshotPreview: FunctionComponent<IScreenshotPreviewProps> = ({
  uri,
  ...imageProps
}) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const flatListRef = useRef<FlatList>(null);

  const Button = useCallback(
    (right: boolean) => {
      return (
        <Box
          zIndex={1}
          position="absolute"
          left={right ? undefined : 0}
          right={right ? 0 : undefined}
        >
          <TouchableOpacity
            onPress={() => {
              flatListRef.current?.scrollToIndex({
                index: (right ? pageNumber + 1 : pageNumber - 1) - 1,
                animated: true,
              });
              setPageNumber(right ? pageNumber + 1 : pageNumber - 1);
            }}
          >
            <Box
              pt="4px"
              px="16px"
              borderRadius="4px"
              backgroundColor="brandSecondary"
            >
              <Typography variant="button" color="brandPrimary">
                {right ? pageNumber + 1 : pageNumber - 1}
              </Typography>
            </Box>
          </TouchableOpacity>
        </Box>
      );
    },
    [pageNumber]
  );

  if (Array.isArray(uri)) {
    return (
      <Box position="relative" justifyContent="center">
        {pageNumber + 1 <= uri.length && Button(true)}
        {pageNumber - 1 > 0 && Button(false)}
        <Styled.FlatList
          onScrollToIndexFailed={console.log}
          ref={flatListRef}
          removeClippedSubviews
          horizontal
          data={uri}
          scrollEventThrottle={16}
          onScroll={({ nativeEvent: { contentOffset, layoutMeasurement } }) => {
            const newPageNumber =
              Math.round(contentOffset.x / layoutMeasurement.width) + 1;
            if (newPageNumber === pageNumber) return;
            setPageNumber(newPageNumber);
          }}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          renderItem={({ item, index }) => {
            return (
              <Styled.ListItem key={index}>
                <Styled.Image
                  resizeMode="stretch"
                  source={{ uri: item }}
                  {...imageProps}
                />
              </Styled.ListItem>
            );
          }}
        />
      </Box>
    );
  }

  return (
    <Styled.Wrapper>
      <Styled.Image resizeMode="stretch" {...imageProps} source={{ uri }} />
    </Styled.Wrapper>
  );
};

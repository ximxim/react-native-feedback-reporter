import React, { forwardRef, useCallback, useEffect } from 'react';
import { View, TouchableWithoutFeedback, LayoutAnimation } from 'react-native';

import { Checkbox } from '../../../../data';
import { Box, Typography } from '../../../../ui';
import type { IUploadFile } from '../../../../../utils';

interface IAttachmentsProps {
  allFilesToUpload: IUploadFile[];
  setFilesToUpload: (files: IUploadFile[]) => void;
}

export const Attachments = forwardRef<any, IAttachmentsProps>(
  ({ allFilesToUpload, setFilesToUpload }, ref) => {
    const handlePatch = useCallback(
      (index: number, patchFile: Partial<IUploadFile>) =>
        setFilesToUpload(
          allFilesToUpload.map((file, i) =>
            index === i ? { ...file, ...patchFile } : { ...file }
          )
        ),
      [allFilesToUpload]
    );

    useEffect(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [allFilesToUpload]);

    return (
      <View ref={ref}>
        {allFilesToUpload.map((file, index) => (
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Checkbox
              label={file.filename}
              defaultValue={!file.exempt}
              onChange={(value) => handlePatch(index, { exempt: !value })}
            />
            <TouchableWithoutFeedback
              delayLongPress={5000}
              onLongPress={() => handlePatch(index, { preview: new Date() })}
            >
              <Box
                p="8px"
                mr="8px"
                opacity={0.75}
                borderWidth={1}
                borderRadius={4}
                borderColor="brandMuted"
              >
                <Typography fontSize="9px">
                  {file.filename.split('.').pop()?.toUpperCase()}
                </Typography>
              </Box>
            </TouchableWithoutFeedback>
          </Box>
        ))}
      </View>
    );
  }
);

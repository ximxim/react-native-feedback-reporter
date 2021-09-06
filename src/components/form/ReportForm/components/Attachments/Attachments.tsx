import React, { forwardRef, useCallback, useEffect } from 'react';
import { View, TouchableWithoutFeedback, LayoutAnimation } from 'react-native';

import { Checkbox } from '../../../../data';
import { Box, Typography } from '../../../../ui';
import type { IUploadFile } from '../../../../../utils';

interface IAttachmentsProps {
  files: IUploadFile[];
  setFiles: (files: IUploadFile[]) => void;
}

export const Attachments = forwardRef<any, IAttachmentsProps>(
  ({ files, setFiles }, ref) => {
    const handlePatch = useCallback(
      (index: number, patchFile: Partial<IUploadFile>) =>
        setFiles(
          files.map((file, i) =>
            index === i ? { ...file, ...patchFile } : { ...file }
          )
        ),
      [files]
    );

    useEffect(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [files]);

    return (
      <View ref={ref}>
        {files.map((file, index) => (
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

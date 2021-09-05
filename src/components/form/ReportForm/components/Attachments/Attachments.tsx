import React, { forwardRef, useCallback } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';

import { Checkbox } from '../../../../data';
import { Box, Typography } from '../../../../ui';
import type { IUploadFile } from '../../../../../utils';

interface IAttachmentsProps {
  files: IUploadFile[];
  setFiles: (files: IUploadFile[]) => void;
}

export const Attachments = forwardRef<any, IAttachmentsProps>(
  ({ files, setFiles }, ref) => {
    const handleChange = useCallback(
      (index: number) => (value: boolean) =>
        setFiles(
          files.map((file, i) =>
            index === i ? { ...file, exempt: !value } : { ...file }
          )
        ),
      [files]
    );

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
              onChange={handleChange(index)}
            />
            <TouchableWithoutFeedback
              onLongPress={console.log}
              delayLongPress={5000}
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

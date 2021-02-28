import React, { FunctionComponent, useEffect, useState } from 'react';
import { Modal, View, Image, Text } from 'react-native';
import { ThemeProvider } from 'styled-components';

import { ScreenShot } from './utils';
import { theme } from './theme';

interface IOptional {
  defaultValue?: string;
  isVisible?: boolean;
}
interface IFeedbackReporter {
  isEnabled: boolean;
  /**
   * Project field props
   */
  projectField?: IOptional;

  /**
   * Issue type field props
   */
  issueTypeField?: IOptional;

  /**
   * Steps to create field props
   */
  stepsToCreateField?: IOptional;

  /**
   * Intended outcomefield props
   */
  intendedOutcomeField?: IOptional;

  /**
   * Actual outcomefield props
   */
  actualOutcomeField?: IOptional;

  /**
   * Version field props
   */
  versionField?: IOptional;
}

const FeedbackReporter: FunctionComponent<IFeedbackReporter> = ({
  isEnabled,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [uri, setUri] = useState('');

  useEffect(() => {
    if (!isEnabled) return;
    ScreenShot.startListener((res?: { uri: string; code: number }) => {
      if (res?.code === 200) {
        setIsModalOpen(true);
        setUri(res.uri);
      }
    });
  }, [isEnabled]);

  const ScreenShotImage = (
    <Image
      source={{ uri: `data:image/png;base64,${uri}` }}
      style={{
        resizeMode: 'contain',
        borderWidth: 1,
        borderColor: 'red',
        width: 250,
        height: 500,
      }}
    />
  );

  return (
    <ThemeProvider theme={theme.base}>
      <View>
        <Modal
          visible={isModalOpen}
          presentationStyle="formSheet"
          onDismiss={() => setIsModalOpen(false)}
          onRequestClose={() => setIsModalOpen(false)}
        >
          <Text>Wanna talk about it?</Text>
          {ScreenShotImage}
        </Modal>
      </View>
    </ThemeProvider>
  );
};

export default FeedbackReporter;

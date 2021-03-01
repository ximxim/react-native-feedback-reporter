import { useForm } from 'react-hook-form';
import { ThemeProvider } from 'styled-components';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal, View } from 'react-native';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { theme } from './theme';
import { ScreenShot } from './utils';
import {
  ReportForm,
  IReportFormValues,
  ReportFormValidation,
  GlobalProps,
  IGlobalProps,
} from './components';

const FeedbackReporter: FunctionComponent<IGlobalProps> = ({ isEnabled }) => {
  const formProps = useForm<IReportFormValues>({
    resolver: yupResolver(ReportFormValidation),
    reValidateMode: 'onChange',
    defaultValues: {},
  });
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    formProps.register({ name: 'uri' });

    return () => formProps.unregister(['uri']);
  }, [formProps.register]);

  useEffect(() => {
    if (!isEnabled) return;
    ScreenShot.startListener((res?: { uri: string; code: number }) => {
      if (res?.code === 200) {
        setIsModalOpen(true);
        formProps.setValue('uri', res.uri);
      }
    });
  }, [isEnabled]);

  return (
    <GlobalProps.Provider value={{ isEnabled: true }}>
      <ThemeProvider theme={theme.dark}>
        <View>
          <Modal
            visible={isModalOpen}
            presentationStyle="fullScreen"
            onDismiss={() => setIsModalOpen(false)}
            onRequestClose={() => setIsModalOpen(false)}
          >
            <ReportForm {...formProps} />
          </Modal>
        </View>
      </ThemeProvider>
    </GlobalProps.Provider>
  );
};

export default FeedbackReporter;

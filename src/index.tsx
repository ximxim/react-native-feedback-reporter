import axios from 'axios';
import { useForm } from 'react-hook-form';
import { ThemeProvider } from 'styled-components';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal, View } from 'react-native';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { theme } from './theme';
import { ScreenShot } from './utils';
import { QueryClient, QueryClientProvider } from 'react-query';

import {
  ReportForm,
  IReportFormValues,
  ReportFormValidation,
  GlobalProps,
  IGlobalProps,
} from './components';

const queryClient = new QueryClient();

const FeedbackReporter: FunctionComponent<IGlobalProps> = ({ isEnabled }) => {
  // TODO: use props to set these headers
  axios.defaults.headers.common = {
    Accept: 'application/json',
    Authorization:
      'Basic YXppbS5haG1lZDdAZ21haWwuY29tOjJyRUtraGlpdDN4M2tnR0FwWGVQOTQ5NQ==',
  };
  const formProps = useForm<IReportFormValues>({
    resolver: yupResolver(ReportFormValidation),
    reValidateMode: 'onChange',
    defaultValues: {},
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <QueryClientProvider client={queryClient}>
      <GlobalProps.Provider value={{ isEnabled }}>
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
    </QueryClientProvider>
  );
};

export default FeedbackReporter;

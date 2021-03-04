import { Modal } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import { ThemeProvider } from 'styled-components';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { theme } from './theme';
import { ScreenShot } from './utils';
import { QueryClient, QueryClientProvider } from 'react-query';

import {
  ReportForm,
  GlobalProps,
  ModalHeader,
  IReportFormValues,
  ReportFormValidation,
  IFeedbackReporterProps,
} from './components';
import * as Styled from './index.style';

const queryClient = new QueryClient();

const FeedbackReporter: FunctionComponent<IFeedbackReporterProps> = ({
  mode = 'onScreenShot',
  ...props
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleClose = () => setIsModalOpen(false);
  const formProps = useForm<IReportFormValues>({
    resolver: yupResolver(ReportFormValidation),
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    formProps.register({ name: 'uri' });

    return () => formProps.unregister(['uri']);
  }, [formProps.register]);

  useEffect(() => {
    if (mode !== 'onScreenShot') return;
    ScreenShot.startListener((res?: { uri: string; code: number }) => {
      if (res?.code === 200) {
        setIsModalOpen(true);
        formProps.setValue('uri', res.uri);
      }
    });
  }, [mode]);

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalProps.Provider value={{ mode, ...props }}>
        <ThemeProvider theme={theme.dark}>
          <Modal
            visible={isModalOpen}
            animationType="slide"
            onDismiss={handleClose}
            onRequestClose={handleClose}
          >
            <FormProvider {...formProps}>
              <Styled.Wrapper>
                <ModalHeader
                  heading={'Wanna talk about it?'}
                  right={{ label: 'Close', onPress: handleClose }}
                />
                <ReportForm />
              </Styled.Wrapper>
            </FormProvider>
          </Modal>
        </ThemeProvider>
      </GlobalProps.Provider>
    </QueryClientProvider>
  );
};

export default FeedbackReporter;

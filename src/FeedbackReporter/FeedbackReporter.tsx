import { Modal } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import { ThemeProvider } from 'styled-components';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { theme } from '../theme';
import { ScreenShot } from '../utils';
import { QueryClient, QueryClientProvider } from 'react-query';

import {
  Popover,
  ReportForm,
  GlobalProps,
  ModalHeader,
  IReportFormValues,
  ReportFormValidation,
  IFeedbackReporterProps,
} from '../components';
import * as Styled from './FeedbackReporter.style';

const queryClient = new QueryClient();

export const FeedbackReporter: FunctionComponent<IFeedbackReporterProps> = ({
  mode = 'onScreenShot',
  ...props
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const reportFormProps = useForm<IReportFormValues>({
    reValidateMode: 'onChange',
    resolver: yupResolver(ReportFormValidation({ mode, ...props })),
  });
  const handleClose = () => {
    setIsModalOpen(false);
    reportFormProps.reset();
  };

  useEffect(() => {
    reportFormProps.register({ name: 'uri' });

    return () => reportFormProps.unregister(['uri']);
  }, [reportFormProps.register]);

  useEffect(() => {
    if (mode !== 'onScreenShot') return;
    ScreenShot.startListener((res?: { uri: string; code: number }) => {
      if (res?.code === 200) {
        setIsModalOpen(true);
        reportFormProps.setValue('uri', res.uri);
      }
    });
  }, [mode]);

  let selectedTheme;

  if (!props.theme) {
    selectedTheme = theme.base;
  } else if (typeof props.theme === 'string') {
    selectedTheme = theme[props.theme];
  } else {
    selectedTheme = props.theme;
  }

  const { header, ...modalProps } = props.modalProps || { header: {} };

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalProps.Provider value={{ mode, isModalOpen, ...props }}>
        <ThemeProvider theme={selectedTheme}>
          <Modal
            visible={isModalOpen}
            animationType="slide"
            onDismiss={handleClose}
            onRequestClose={handleClose}
            {...modalProps}
          >
            <Popover>
              <FormProvider {...reportFormProps}>
                <Styled.Wrapper>
                  <ModalHeader
                    heading={'Wanna talk about it?'}
                    right={{ label: 'Close', onPress: handleClose }}
                    {...header}
                  />
                  <ReportForm handleClose={handleClose} />
                </Styled.Wrapper>
              </FormProvider>
            </Popover>
          </Modal>
        </ThemeProvider>
      </GlobalProps.Provider>
    </QueryClientProvider>
  );
};

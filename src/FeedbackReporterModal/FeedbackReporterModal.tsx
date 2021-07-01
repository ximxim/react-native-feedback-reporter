import React, { useEffect, useContext, FunctionComponent } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ThemeProvider } from 'styled-components';
import { Modal } from 'react-native';

import { theme } from '../theme';
import { ScreenShot } from '../utils';
import { QueryClient, QueryClientProvider } from 'react-query';

import {
  Popover,
  ReportForm,
  ModalHeader,
  GlobalProps,
  IReportFormValues,
  ReportFormValidation,
} from '../components';
import * as Styled from './FeedbackReporterModal.style';

const queryClient = new QueryClient();

export const FeedbackReporterModal: FunctionComponent<unknown> = () => {
  const props = useContext(GlobalProps);
  const reportFormProps = useForm<IReportFormValues>({
    reValidateMode: 'onChange',
    resolver: yupResolver(ReportFormValidation({ ...props })),
  });
  const handleClose = () => {
    props.setIsModalOpen(false);
    reportFormProps.reset();
  };

  useEffect(() => {
    reportFormProps.register({ name: 'uri' });

    return () => reportFormProps.unregister(['uri']);
  }, [reportFormProps.register]);

  useEffect(() => {
    if (props.mode !== 'onScreenShot') return;
    ScreenShot.startListener((res?: { uri: string; code: number }) => {
      if (res?.code === 200) {
        props.setIsModalOpen(true);
        reportFormProps.setValue('uri', res.uri);
      }
    });
  }, [props.mode]);

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
      <ThemeProvider theme={selectedTheme}>
        <Modal
          visible={props.isModalOpen}
          animationType="slide"
          onDismiss={handleClose}
          onRequestClose={handleClose}
          {...modalProps}
        >
          <Popover>
            <FormProvider {...reportFormProps}>
              <Styled.Wrapper>
                <ModalHeader
                  left={props.modalHeaderLeftState}
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
    </QueryClientProvider>
  );
};

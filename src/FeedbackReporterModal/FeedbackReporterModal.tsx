import React, {
  useEffect,
  useContext,
  useCallback,
  FunctionComponent,
} from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ThemeProvider } from 'styled-components';
import { Modal, NativeModules, Alert } from 'react-native';

import { useLogs } from '../hooks';
import { theme } from '../theme';
import { ScreenShot } from '../utils';
import { QueryClient, QueryClientProvider } from 'react-query';

import {
  Logs,
  Popover,
  ReportForm,
  ModalHeader,
  GlobalProps,
  IReportFormValues,
  ReportFormValidation,
} from '../components';
import * as Styled from './FeedbackReporterModal.style';

const queryClient = new QueryClient();
const module = NativeModules.FeedbackReporter;
const clearTmpDirectory = module.clearTmpDirectory;

export const FeedbackReporterModal: FunctionComponent<unknown> = () => {
  const logsValues = useLogs();
  const props = useContext(GlobalProps);
  const reportFormProps = useForm<IReportFormValues>({
    reValidateMode: 'onChange',
    resolver: yupResolver(ReportFormValidation({ ...props })),
  });
  const handleClose = useCallback(() => {
    if (props.isBusy) {
      Alert.alert('Are you sure?', 'RNFR is busy at the moment', [
        { text: 'No' },
        {
          text: 'Yes',
          onPress: () => {
            props.setIsBusy(false);
            closeFlow();
          },
        },
      ]);
      return;
    }

    closeFlow();
  }, [props.isBusy]);

  const closeFlow = useCallback(() => {
    clearTmpDirectory();
    props.setIsModalOpen(false);
    reportFormProps.reset();
  }, [props.setIsModalOpen, reportFormProps.reset]);

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
          onRequestClose={handleClose}
          {...modalProps}
        >
          <Logs.Provider value={logsValues}>
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
          </Logs.Provider>
        </Modal>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

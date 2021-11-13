import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Linking } from 'react-native';
import { useQuery } from 'react-query';

import type {
  IAccountLinkingFormProps,
  IAccountLinkingFormValues,
} from './AccountLinkingForm.types';
import { AccountLinkingFormValidation } from './AccountLinkingForm.validation';

import { getJIRASelf } from '../../queries';
import { initJIRAApi } from '../../JIRAApi.service';

import {
  Box,
  TextInput,
  Typography,
  GlobalProps,
  ButtonWithLabel,
} from '../../../../components';

export const AccountLinkingForm: FunctionComponent<IAccountLinkingFormProps> = () => {
  const { setAuthState, jira } = useContext(GlobalProps);
  const [initialized, setInitialized] = useState<boolean>(false);
  const {
    setValue,
    errors,
    control,
    register,
    getValues,
    unregister,
    handleSubmit,
  } = useForm<IAccountLinkingFormValues>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: yupResolver(AccountLinkingFormValidation),
  });
  const { data, isLoading, error } = useQuery('JIRASelf', getJIRASelf, {
    enabled: initialized,
  });

  const onSubmit = handleSubmit((values) => {
    if (!jira) return;
    initJIRAApi({ ...jira, jira: values });
    setInitialized(true);
  });

  useEffect(() => {
    if (!data?.data.emailAddress) return;
    const values = getValues();
    if (!values.username || !values.token) return;
    setAuthState({
      jira: {
        ...values,
        username: values.username.toLowerCase(),
      },
    });
  }, [data]);

  useEffect(() => {
    if (!error) return;
    setInitialized(false);
    setAuthState({});
  }, [error]);

  useEffect(() => {
    register({ name: 'username' });
    register({ name: 'token' });

    return () => unregister(['username', 'token']);
  }, [register]);

  return (
    <Box pb={32}>
      <TextInput
        label="Username"
        hideErrorMessage
        autoCapitalize="none"
        onBlur={() => control.trigger('username')}
        error={errors.username?.message}
        placeholder={errors.username?.message}
        onChangeText={(text) => setValue('username', text)}
      />
      <TextInput
        label="API token"
        secureTextEntry
        hideErrorMessage
        error={errors.token?.message}
        onBlur={() => control.trigger('token')}
        placeholder={errors.token?.message}
        onChangeText={(text) => setValue('token', text)}
      />
      <Typography variant="caption" mx="8px">
        How to create a JIRA api token?{' '}
        <Typography
          ml={2}
          variant="link"
          onPress={() =>
            Linking.openURL(
              'https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/#APItokens-CreateanAPItoken'
            )
          }
        >
          Guide me
        </Typography>
      </Typography>
      <ButtonWithLabel onPress={onSubmit} isLoading={isLoading}>
        Link Account
      </ButtonWithLabel>
    </Box>
  );
};

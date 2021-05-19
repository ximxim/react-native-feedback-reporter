import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
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
  ButtonWithLabel,
  GlobalProps,
} from '../../../../components';

export const AccountLinkingForm: FunctionComponent<IAccountLinkingFormProps> = ({
  next,
}) => {
  const { setAuthState, jira } = useContext(GlobalProps);
  const [initialized, setInitialized] = useState<boolean>(false);
  const {
    setValue,
    errors,
    handleSubmit,
    register,
    getValues,
    unregister,
  } = useForm<IAccountLinkingFormValues>({
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
    setAuthState({
      jira: {
        ...values,
        username: values.username.toLowerCase(),
      },
    });
    next();
  }, [data]);

  useEffect(() => {
    if (!error) return;
    setAuthState({});
  }, [error]);

  useEffect(() => {
    register({ name: 'username' });
    register({ name: 'token' });

    return () => unregister(['username', 'token']);
  }, [register]);

  return (
    <Box mb={40}>
      <TextInput
        label="Username"
        autoCapitalize="none"
        error={errors.username?.message}
        onChangeText={(text) => setValue('username', text)}
      />
      <TextInput
        label="API token"
        secureTextEntry
        error={errors.token?.message}
        onChangeText={(text) => setValue('token', text)}
      />
      <Typography variant="caption" mx={2}>
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
      <ButtonWithLabel onPress={onSubmit}>
        {isLoading ? 'Linking...' : 'Link Account'}
      </ButtonWithLabel>
    </Box>
  );
};

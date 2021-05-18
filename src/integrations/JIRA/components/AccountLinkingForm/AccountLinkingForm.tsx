import React, { FunctionComponent, useContext, useEffect } from 'react';
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
  const { setAuthState, authState } = useContext(GlobalProps);
  const { data, isLoading } = useQuery('JIRASelf', getJIRASelf, {
    enabled: !!authState.jira?.username && !!authState.jira.token,
  });
  const {
    setValue,
    errors,
    handleSubmit,
    register,
    unregister,
  } = useForm<IAccountLinkingFormValues>({
    reValidateMode: 'onChange',
    resolver: yupResolver(AccountLinkingFormValidation),
  });

  const onSubmit = handleSubmit((values) => {
    setAuthState({
      jira: {
        ...values,
        username: values.username.toLowerCase(),
      },
    });
  });

  useEffect(() => {
    if (!data?.data.emailAddress) return;
    next();
  }, [data]);

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
      <ButtonWithLabel onPress={onSubmit} isLoading={isLoading}>
        Link Account
      </ButtonWithLabel>
    </Box>
  );
};

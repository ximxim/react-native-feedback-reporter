import React, { FunctionComponent, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Linking } from 'react-native';

import type {
  IAccountLinkingFormProps,
  IAccountLinkingFormValues,
} from './AccountLinkingForm.types';
import { AccountLinkingFormValidation } from './AccountLinkingForm.validation';

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
  const { setAuthState } = useContext(GlobalProps);
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
      },
    });
    next();
  });

  useEffect(() => {
    register({ name: 'username' });
    register({ name: 'token' });

    return () => unregister(['username', 'token']);
  }, [register]);

  return (
    <Box mb={40}>
      <TextInput
        label="Username"
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
      <ButtonWithLabel onPress={onSubmit}>Link Account</ButtonWithLabel>
    </Box>
  );
};

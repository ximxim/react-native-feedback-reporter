import * as yup from 'yup';

export const slackFormValidation = {
  slackSwitch: yup.boolean(),
  slackChannel: yup.string().when('slackSwitch', {
    is: true,
    then: yup.string().required('Channel is required'),
  }),
};

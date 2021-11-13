import * as Sentry from '@sentry/react-native';
import { SENTRY, JIRA_DOMAIN, SLACK_BOT_TOKEN } from '@env';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import {
  theme,
  SlackComponents,
  JIRAComponents,
  FeedbackReporter,
} from 'react-native-feedback-reporter';
import DeviceInfo from 'react-native-device-info';

import { Form } from './Form';
import { Modal } from './Modal';
import { WebView } from './WebView';
import { SomeText } from './SomeText';
import { LOGIN_SUCCESS } from './userReducers';

Sentry.init({ dsn: SENTRY });

// console.disableYellowBox = true;

export default function App() {
  const handleShow = () => console.log('OMG you showed');
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch({ type: LOGIN_SUCCESS });
  }, []);

  return (
    <FeedbackReporter
      disableBreadrumbs={false}
      containerViewProps={{
        style: { justifyContent: 'center', alignItems: 'center' },
      }}
      theme={{
        ...theme.base,
        colors: {
          ...theme.base.colors,
          brandPrimary: '#feda4a',
          brandSecondary: 'black',
        },
      }}
      modalProps={{
        onShow: handleShow,
        header: { heading: 'Custom Heading' },
      }}
      slack={{
        channel: 'random',
        botToken: SLACK_BOT_TOKEN,
        order: [
          SlackComponents.SlackSwitch,
          SlackComponents.SlackChannelsSelector,
        ],
      }}
      jira={{
        domain: JIRA_DOMAIN,
        issueTypeField: {
          defaultValue: 'story',
        },
        projectField: {
          defaultValue: 'apitest',
        },
        order: [
          JIRAComponents.JIRASwitch,
          JIRAComponents.JIRAProjects,
          JIRAComponents.JIRAIssueTypes,
          JIRAComponents.JIRAAccountLinking,
        ],
        meta: {
          labels: ['test', 'this'],
        },
      }}
      extraSource="react-native-image-crop-picker"
      devNotes={async () => {
        const [
          deviceName,
          ipAddress,
          manufacturer,
          powerState,
        ] = await Promise.all([
          DeviceInfo.getDeviceName(),
          DeviceInfo.getIpAddress(),
          DeviceInfo.getManufacturer(),
          DeviceInfo.getPowerState(),
        ]);

        return `
Brand: ${DeviceInfo.getBrand()}
Build Number: ${DeviceInfo.getBuildNumber()}
Bundle ID: ${DeviceInfo.getBundleId()}
Device ID: ${DeviceInfo.getDeviceId()}
Device Name: ${deviceName}
IP Address: ${ipAddress}
Manufacturer: ${manufacturer}
Model: ${DeviceInfo.getModel()}
Power State: ${JSON.stringify(powerState)}
Readable Version: ${DeviceInfo.getReadableVersion()}
System Name: ${DeviceInfo.getSystemName()}
Systerm Version: ${DeviceInfo.getSystemVersion()}
Unique ID: ${DeviceInfo.getUniqueId()}
Version: ${DeviceInfo.getVersion()}
        `;
      }}
    >
      <View style={styles.container}>
        <WebView />
        <Modal />
        <Form />
        <SomeText />
      </View>
    </FeedbackReporter>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

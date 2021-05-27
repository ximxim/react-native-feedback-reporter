import RNSecureKeyStore, { ACCESSIBLE } from 'react-native-secure-key-store';
import * as Sentry from '@sentry/react-native';
import { SENTRY, JIRA_DOMAIN, SLACK_BOT_TOKEN } from '@env';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
import {
  theme,
  SlackComponents,
  JIRAComponents,
  FeedbackReporter,
} from 'react-native-feedback-reporter';
import DeviceInfo from 'react-native-device-info';

import { LOGIN_SUCCESS } from './userReducers';

Sentry.init({ dsn: SENTRY });

export default function App() {
  const handleShow = () => console.log('OMG you showed');
  const dispatch = useDispatch();

  React.useEffect(() => {
    RNSecureKeyStore?.setResetOnAppUninstallTo?.(false);
    dispatch({ type: LOGIN_SUCCESS });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result of some sort</Text>
      <FeedbackReporter
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
        }}
        extraSource="react-native-image-crop-picker"
        asyncStorage={{
          getItem: (key) => {
            return RNSecureKeyStore.get(key);
          },
          setItem: (key, value) => {
            return RNSecureKeyStore.set(key, value, {
              accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
            });
          },
        }}
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});

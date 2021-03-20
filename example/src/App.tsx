import { SLACK_BOT_TOKEN, JIRA_DOMAIN, JIRA_USERNAME, JIRA_TOKEN } from '@env';
import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FeedbackReporter, theme } from 'react-native-feedback-reporter';
import DeviceInfo from 'react-native-device-info';

export default function App() {
  const handleShow = () => console.log('OMG you showed');

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
        }}
        jira={{
          domain: JIRA_DOMAIN,
          username: JIRA_USERNAME,
          token: JIRA_TOKEN,
          issueTypeField: {
            defaultValue: 'story',
            isVisible: false,
          },
          projectField: {
            defaultValue: 'apitest',
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

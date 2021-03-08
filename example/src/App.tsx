import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FeedbackReporter, theme } from 'react-native-feedback-reporter';
import DeviceInfo from 'react-native-device-info';

export default function App() {
  const [asyncInfo, setAsyncInfo] = React.useState({
    deviceName: '',
    ipAddress: '',
    manufacturer: '',
    powerState: {},
  });
  const handleShow = () => console.log('OMG you showed');

  React.useEffect(() => {
    (async () => {
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

      setAsyncInfo({ deviceName, ipAddress, manufacturer, powerState })
    })();
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
        modalProps={{ onShow: handleShow }}
        jira={{
          domain: 'https://ximxim.atlassian.net',
          username: 'azim.ahmed7@gmail.com',
          token: '2rEKkhiit3x3kgGApXeP9495',
          issueTypeField: {
            defaultValue: 'story',
            isVisible: false,
          },
          projectField: {
            defaultValue: 'apitest',
          },
        }}
        devNotes={`
          Brand: ${DeviceInfo.getBrand()}
          Build Number: ${DeviceInfo.getBuildNumber()}
          Bundle ID: ${DeviceInfo.getBundleId()}
          Device ID: ${DeviceInfo.getDeviceId()}
          Device Name: ${asyncInfo.deviceName}
          IP Address: ${asyncInfo.ipAddress}
          Manufacturer: ${asyncInfo.manufacturer}
          Model: ${DeviceInfo.getModel()}
          Power State: ${JSON.stringify(asyncInfo.powerState)}
          Readable Version: ${DeviceInfo.getReadableVersion()}
          System Name: ${DeviceInfo.getSystemName()}
          Systerm Version: ${DeviceInfo.getSystemVersion()}
          Unique ID: ${DeviceInfo.getUniqueId()}
          Version: ${DeviceInfo.getVersion()}
        `}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});

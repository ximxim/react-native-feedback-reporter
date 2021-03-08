import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FeedbackReporter, theme } from 'react-native-feedback-reporter';

export default function App() {
  'https://ximxim.atlassian.net/rest/api/3/issue/AP-2/attachments';
  const [result] = React.useState<number | undefined>();
  const handleShow = () => console.log('OMG you showed');

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
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
          Brand: Apple
          Build Number: 89
          Bundle ID: com.example.AwesomeApp
          Device ID: iPhone7,2
          Device Name: Becca's iPhone 6
          IP Address: 92.168.32.44
          Manufacturer: Apple
          Model: ?
          Power State: { batteryLevel: 0.759999, batteryState: 'unplugged', lowPowerMode: false }
          Readable Version: 1.0.1.32
          System Name: iOS
          Systerm Version: 11.0
          Unique ID: FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9
          Version: 1.0
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

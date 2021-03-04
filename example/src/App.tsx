import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import FeedbackReporter from 'react-native-feedback-reporter';

export default function App() {
  const [result] = React.useState<number | undefined>();

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
      <FeedbackReporter
        jira={{
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

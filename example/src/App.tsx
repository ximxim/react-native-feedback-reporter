import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { FeedbackReporter } from 'react-native-feedback-reporter';

export default function App() {
  const [result] = React.useState<number | undefined>();
  const handleShow = () => console.log('OMG you showed');

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
      <FeedbackReporter
        modalProps={{ onShow: handleShow }}
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
        devNotes="These are some devnotes to help understanding the ticket"
        attachments={[]}
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

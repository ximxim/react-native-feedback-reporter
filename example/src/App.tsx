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
        devNotes="These are some devnotes to help understanding the ticket"
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

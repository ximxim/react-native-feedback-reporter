import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  NativeModules,
  TouchableOpacity,
} from 'react-native';
import {
  FeedbackReporter,
  getExportContent,
} from 'react-native-feedback-reporter';

export default function App() {
  const module = NativeModules.FeedbackReporter;
  const path = module.TemporaryDirectoryPath + '/state.json';
  const uploadUrl =
    'https://ximxim.atlassian.net/rest/api/3/issue/AP-2/attachments';
  const [result] = React.useState<number | undefined>();
  const handleShow = () => console.log('OMG you showed');
  const files = [
    {
      name: 'file',
      filename: 'state.json',
      filepath: path,
      filetype: 'application/json',
    },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={async () => {
          // @ts-ignore
          // eslint-disable-next-line no-undef
          const content = btoa(getExportContent());
          await module.writeFile(path, content, {
            encoding: 'base64',
          });
          // upload files
          const response = await module.uploadFiles({
            jobId: 1,
            toUrl: uploadUrl,
            files: files,
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'X-Atlassian-Token': 'no-check',
              // @ts-ignore
              // eslint-disable-next-line no-undef
              'Authorization': `Basic ${btoa(
                `azim.ahmed7@gmail.com:2rEKkhiit3x3kgGApXeP9495`
              )}`,
            },
            begin: console.log,
            progress: console.log,
          });

          if (response.statusCode === 200) {
            console.log(response);
            console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
          } else {
            console.log('SERVER ERROR');
          }
        }}
      >
        <Text>Result: {result}</Text>
      </TouchableOpacity>
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

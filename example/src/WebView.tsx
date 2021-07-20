import React, { FunctionComponent, useState } from 'react';
import { WebView as RNWebView } from 'react-native-webview';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export const WebView: FunctionComponent<unknown> = () => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(!visible)}>
        <Text style={styles.text}>{visible ? 'Close' : 'Open'} WebView</Text>
      </TouchableOpacity>
      {visible && (
        <View style={styles.webView}>
          <RNWebView
            style={styles.webView}
            source={{
              uri: 'https://ximxim.github.io/react-native-feedback-reporter/',
            }}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  webView: {
    width,
    height: height / 2,
    maxHeight: height / 2,
  },
  text: {
    margin: 10,
  },
});

import React, { FunctionComponent, useState } from 'react';
import { WebView as RNWebView } from 'react-native-webview';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal as RNModal,
} from 'react-native';

export const Modal: FunctionComponent<unknown> = () => {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text style={styles.text}>Open Modal</Text>
      </TouchableOpacity>
      <RNModal
        visible={visible}
        animationType="slide"
        presentationStyle="formSheet"
      >
        <TouchableOpacity
          onPress={() => setVisible(false)}
          style={styles.closeModalButton}
        >
          <Text style={styles.closeModalText}>Close Modal</Text>
        </TouchableOpacity>
        <RNWebView
          source={{
            uri: 'https://ximxim.github.io/react-native-feedback-reporter/',
          }}
        />
      </RNModal>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    margin: 10,
  },
  closeModalButton: {
    padding: 10,
    backgroundColor: 'black',
  },
  closeModalText: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
  },
});

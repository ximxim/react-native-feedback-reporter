import React, { FunctionComponent } from 'react';
import { TextInput, StyleSheet } from 'react-native';

export const Form: FunctionComponent<unknown> = () => {
  return (
    <>
      <TextInput
        defaultValue="something"
        style={styles.textInput}
        placeholder="Regular Input"
      />
      <TextInput
        defaultValue="something"
        secureTextEntry
        style={styles.textInput}
        placeholder="Secure Input"
      />
    </>
  );
};

const styles = StyleSheet.create({
  textInput: {
    margin: 10,
    padding: 10,
    width: '90%',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'black',
  },
});

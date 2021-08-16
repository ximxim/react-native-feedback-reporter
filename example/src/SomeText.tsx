import React, { FunctionComponent } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useDeveloperOverride } from 'react-native-feedback-reporter';

export const SomeText: FunctionComponent<unknown> = () => {
  const { increment } = useDeveloperOverride(10);

  return (
    <TouchableOpacity onPress={increment}>
      <Text style={styles.text}>Touch this text 10 times to enable</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    margin: 10,
  },
});

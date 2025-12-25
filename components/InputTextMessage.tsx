import React, { forwardRef } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, TextInputProps, StyleProp, ViewStyle, TextStyle, Platform } from 'react-native';
import { verticalScale, scale } from '../utils/styling';
import { InputProps } from '../types'

const InputTextMessage = forwardRef<TextInput, InputProps>((props, ref) => {
  return (
    <View style={[styles.container, props.containerStyle && props.containerStyle]}>
      
      <TextInput
        style={[
          styles.input,
          props.inputStyle
        ]}
        placeholderTextColor={'#515050ff'}
        ref={ref}
        {...props}
       
      />
      
    </View>
  );
});

export default InputTextMessage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f1efefb9",
    borderWidth: 1,
    borderColor: '#1a191915',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: scale(24),
    gap: 10,
    width: '80%',
    maxHeight: scale(100),
  },
  input: {
    color: '#000',
    fontSize: Platform.OS === 'ios' ? scale(16) : scale(12),
  },
  
});

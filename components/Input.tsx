import React, { forwardRef } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, TextInputProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { verticalScale } from '../utils/styling';
import { InputProps } from '../types'

const Input = forwardRef<TextInput, InputProps>((props, ref) => {
  return (
    <View style={[styles.container, props.containerStyle && props.containerStyle]}>
      {
        props.icon && props.icon
      }
      <TextInput
        style={[
          styles.input,
          props.inputStyle
        ]}
        placeholderTextColor={'#515050ff'}
        ref={ref}
        {...props}
      />
      {
        props.rightIcon && (
          <TouchableOpacity onPress={props.onPressRightIcon} style={styles.rightIcon} >
            {props.rightIcon}
          </TouchableOpacity>
        )
      }
    </View>
  );
});

export default Input;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: verticalScale(54),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffffff69',
    borderRadius: 17,
    borderCurve: 'continuous',
    paddingHorizontal: 15,
    gap: 10,
  },
  input: {
    flex: 1,
    color: '#000',
    fontSize: verticalScale(18),
  },
  rightIcon: {
    // color: '#515050ff',
  }
});

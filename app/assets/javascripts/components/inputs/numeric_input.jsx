import React, { Component } from 'react';
import SlowTextInput from '../inputs/slow_text_input';
import { intFilter, floatFilter } from '../../utils/keycode';

// this is an input to edit numbers - it applies some filters
// to prevent non-numerical characters.
// it has a prop 'inputType' with values float, int to filter
// for either floats or ints

const floatTransform = (value) => parseFloat(value);
const intTransform = (value) => parseInt(value.replace(/_/, ''));

const numericInput = (filter,transform) => (WrappedInput) => ({onChange, ...otherProps}) =>
  <WrappedInput
    onKeyPress={ filter }
    onChange={ (value) => onChange(transform(value)) }
    {...otherProps}
  />;

export const withIntegerFilter = numericInput(intFilter, intTransform);

export const IntegerInput = withIntegerFilter(SlowTextInput);
export const FloatInput = numericInput(floatFilter, floatTransform)(SlowTextInput);

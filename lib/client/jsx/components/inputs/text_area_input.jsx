import React, { Component } from 'react';
import debounce from '../../utils/debounce';

// this is an input that debounces text input of some sort
export default class TextAreaInput extends Component {
  constructor() {
    super();
    this.state = {};
  }

  onChange(value) {
    this.props.onChange(value);
  }

  handleChange() {
    let input_value = this.text_input.value;
    this.setState({ input_value });
    this.onChange(input_value);
  }

  componentWillMount() {
    this.onChange = debounce(this.onChange, this.props.waitTime || 500);
  }

  render() {
    let { onChange, waitTime, defaultValue, ...inputProps } = this.props;
    let { input_value } = this.state;

    return(
      <textarea
        ref={ (input) => this.text_input = input }
        onChange={ this.handleChange.bind(this) }
        value={ input_value == undefined ? defaultValue : input_value }
        { ...inputProps }
      />
    );
  }
}

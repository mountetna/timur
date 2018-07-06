import React, { Component } from 'react';

const NoneOption = (showNone) => (
  showNone 
  ? <option disabled={showNone == 'disabled'} key='none' value=''> --- </option>
  : null
);

const Option = (v,i) => (
  Object.keys(v).includes('key', 'value', 'text')
  ? <option key={v.key} value={i}>{ v.text }</option>
  : <option key={v} value={i}>{ v }</option>
);

// This is an input to select one from a list of options
export default class SelectInput extends Component {
  onChange(evt) {
    let index = evt.target.value;
    let { onChange, values } = this.props;
    let value = values[parseInt(index)]

    if (onChange) onChange( value == '' ? null : value );
  }

  render() {
    let { children, values, showNone, defaultValue } = this.props;
    defaultValue = defaultValue || (showNone ? '' : null);

    return(
      <select defaultValue={ defaultValue } onChange={ this.onChange.bind(this) } >
        { children }
        { NoneOption(showNone) }
        { values.map(Option) }
      </select>
    );
  }
}

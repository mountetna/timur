import { Component } from 'react';

const NoneOption = (showNone) => (
  showNone 
  ? <option disabled={showNone == 'disabled'} key='none' value=''> --- </option>
  : null
);

const Option = (v) => (
  Object.keys(v).includes('key', 'value', 'text')
  ? <option key={v.key} value={v.value}>{ v.text }</option>
  : <option key={v} value={v}>{ v }</option>
);

// This is an input to select one from a list of options
export default class SelectInput extends Component {
  onChange(evt) {
    let { value } = evt.target;
    if (this.props.onChange) this.props.onChange( value == '' ? null : value );
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

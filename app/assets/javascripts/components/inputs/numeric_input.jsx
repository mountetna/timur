import { Component } from 'react';
import SlowTextInput from '../inputs/slow_text_input';

// this is an input to edit numbers - it applies some filters
// to prevent non-numerical characters.
// it has a prop 'inputType' with values float, int to filter
// for either floats or ints
export default class NumericInput extends Component {
  floatFilter(e) {
    if (Keycode.is_ctrl(e)) return true;
    if (Keycode.is_number(e)) return true;
    if (Keycode.match(e,/^[\.e\-]$/)) return true;
    if (Keycode.is_printable(e)) {
      e.preventDefault();
      return true;
    }
    return true;
  }

  intFilter(e) {
    if (Keycode.is_ctrl(e)) return true;
    if (Keycode.is_number(e) || Keycode.match(e,/^_$/)) return true;
    if (Keycode.is_printable(e)) {
      e.preventDefault();
      return true;
    }
    return true;
  }

  update(value) {
    let { update, inputType } = this.props;

    if (inputType == 'int') value = value.replace(/_/, '');
    else if (inputType == 'float') value = parseFloat(value);

    update(value);
  }

  render() {
    let { waitTime, onBlur, inputType, placeholder, defaultValue, className } = this.props;
    let filter = inputType == 'int' ? this.intFilter : this.floatFilter;

    return <SlowTextInput 
                waitTime={ waitTime }
                textClassName={ className }
                placeholder={ placeholder }
                onKeyPress={ filter }
                onBlur={ onBlur }
                defaultValue={ defaultValue }
                update={ this.update.bind(this) } />;
  }
}

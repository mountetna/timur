import { Component } from 'react';

// this is an input that debounces text input of some sort
export default class SlowTextInput extends Component {
  constructor() {
    super();
    this.state = {};
  }

  update() {
    this.props.update(this.text_input.value);
  }

  componentWillMount() {
    this.update = $.debounce(this.props.waitTime || 500, this.update);
  }

  render() {
    let { textClassName, defaultValue, placeholder, onBlur, onKeyPress } = this.props;
    let { input_value } = this.state;

    return <input type='text' 
      ref={ (input) => this.text_input = input }
      className={ textClassName }
      onChange={
        (e) => {
          this.setState({ input_value: e.target.value });
          this.update();
        }
      }
      onBlur={ onBlur }
      onKeyPress={ onKeyPress }
      value={ input_value == undefined ? defaultValue : input_value }
      placeholder={ placeholder }/>;
  }
}

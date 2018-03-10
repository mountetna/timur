import React from 'react';

export default class DemographicInput extends React.Component {

  renderElement() {
    let inputElement = null;

    switch(this.props.inputType) {
      case 'string':
        return inputElement = (
          <input 
            key = {'string' + this.props.inputKey}
            className='demographic-input'
            value={this.props.inputValue}
            onChange={this.props.inputChange}
            type='text' />
        );
      case 'number':
        return inputElement = (
          <input
            key = {'number' + this.props.inputKey} 
            className='demographic-input'
            min='0'
            value={this.props.inputValue}
            onChange={this.props.inputChange}
            type='number' />
        );
      case 'date':
        return inputElement = (
          <input 
            key = {'date' + this.props.inputKey}
            className='demographic-input'
            value={this.props.inputValue}
            onChange={this.props.inputChange}
            type='date' />
        );
      case 'regex':
        return inputElement = (
          <select
            key = {'regex' + this.props.inputKey}
            className='demographic-select'
            value={this.props.inputValue}
            onChange={this.props.inputChange}>
            <option defaultvalue=''>Make Selection</option>
            {this.props.selectOptions}
          </select>
        );
      default:
        return inputElement = (<div>Input Type Error</div>);
    }
  }

  render() {
    return this.renderElement() 
  }
}


import React, { Component } from 'react';

export default class DateTimeInput extends Component {
  constructor() {
    super();
    this.state = {
      date: null
    };
  }

  changeDateTime(event){
    this.setState({date: event.target.value});
    this.props.onChange(new Date(event.target.value));
  }

  render(){

    let date_props = {
      onChange: this.changeDateTime.bind(this),
      type: 'date',
      value: (this.state.date) ? this.state.date : ''
    };

    return (
      <div className='date_input'>

        <input {...date_props} />
      </div>
    )
  }
}

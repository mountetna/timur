import { Component } from 'react';
import { formatDate, formatTime } from '../../utils/dates';
import { maskFilter } from '../../utils/keycode';

// a date-time input which emits a new date-time when there is a valid output

export default class DateTimeInput extends Component {
  constructor() {
    super();
    this.state = {}
  }

  componentDidMount() {
    $(this.dateInput).datepicker({
      defaultDate: formatDate(this.props.value),
      dateFormat: 'yy-mm-dd',
      onClose: this.changeDateTime.bind(this, 'date'),
      changeYear: true,
      changeMonth: true,
      showButtonPanel: true
    });
  }

  changeDateTime(part, e) {
    let value = this[part + 'Input'].value;
    this.setState( { [part]: value }, this.updateDateTime.bind(this) );
  }

  updateDateTime() {
    let { onChange, defaultValue } = this.props;
    let { date, time } = this.state;

    date = date || formatDate( defaultValue );
    time = time || formatTime( defaultValue );

    // emit a null
    if (!date && !time) {
      onChange(null);
      return;
    }

    if (!date || !time || time.length != 5) return;

    let [ year, month, day ]  = date.split(/-/);
    let [ hour, minutes ] = time.split(/:/);

    onChange(new Date(year, parseInt(month)-1, day, hour, minutes));
  }

  render() {
    let { defaultValue } = this.props;
    let defaultDate = formatDate(defaultValue);
    let defaultTime = formatTime(defaultValue);
    return <div className='date_input'>
      <input placeholder='YYYY-MM-DD'
          type='text'
          className='date_text' 
          ref={ (input) => this.dateInput = input }
          defaultValue={ defaultDate }/>
      <span className='at_spacer'>@</span>
      <input 
        placeholder='00:00'
        type='text'
        ref={ (input) => this.timeInput = input }
        className='time_text'
        onKeyPress={ maskFilter(/\d\d:\d\d/) }
        defaultValue={ defaultTime }
        onChange={ this.changeDateTime.bind(this,'time') }
        />
    </div>
  }
}

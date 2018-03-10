import { connect } from 'react-redux';

import { reviseDocument } from '../../actions/magma_actions';
import React, { Component } from 'react';
import DateTimeInput from '../inputs/date_time_input';
import { formatDate, formatTime } from '../../utils/dates';

class DateTimeAttribute extends Component {
  render() {
    let { value, mode } = this.props;

    return <div className="value">
      { mode == 'edit' ? this.renderEdit() : this.renderValue(value) }
    </div>
  }

  renderValue(value){
    return <div className='value'>{formatDate(value)}</div>;
  }

  updateDate(new_date) {
    console.log(new_date);
    let { document, template, attribute, reviseDocument } = this.props;
    reviseDocument( document, template, attribute, new_date && new_date.toISOString());
  }

  renderEdit() {
    let { revision } = this.props;
    return <DateTimeInput defaultValue={ revision } onChange={ this.updateDate.bind(this) } />;
  }
}

export default connect(
  null,
  { reviseDocument }
)(DateTimeAttribute);

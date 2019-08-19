import { connect } from 'react-redux';

import { reviseDocument } from '../../actions/magma_actions';
import React, { Component } from 'react';
import DateTimeInput from '../inputs/date_time_input';
import { formatDate, formatTime } from '../../utils/dates';

const DateTimeAttribute = ({value, mode, revised_value,
  document, template, attribute, reviseDocument }) => {
  if (mode != 'edit') return <div className='attribute'>{formatDate(value)}</div>;

  return <div className='attribute'>
    <DateTimeInput
      defaultValue={ revised_value }
      onChange={
        new_date => reviseDocument(
          document, template, attribute, new_date && new_date.toISOString()
        )
      } />;
  </div>
}

export default connect(
  null,
  { reviseDocument }
)(DateTimeAttribute);

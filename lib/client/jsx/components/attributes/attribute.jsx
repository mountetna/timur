import { connect } from 'react-redux';

import { reviseDocument } from '../../actions/magma_actions';
import React, { Component } from 'react';
import SlowTextInput from '../inputs/slow_text_input';

const Attribute = ({ mode, value, revised_value,
  document, template, attribute, reviseDocument }) => {
  if (mode != 'edit') return <div className='attribute'>{ value }</div>;

  return <div className='attribute'>
    <SlowTextInput
    className='full_text'
    placeholder={ attribute.placeholder }
    onChange={ value => { reviseDocument( document, template, attribute, value) } }
    defaultValue={ revised_value } />
  </div>;
}

export default connect(
  null,
  {reviseDocument}
)(Attribute);

import { connect } from 'react-redux';

import { reviseDocument } from 'etna-js/actions/magma_actions';
import React, { Component } from 'react';
import SlowTextInput from '../inputs/slow_text_input';
import SelectAttribute from './select_attribute';

const StringAttribute = (props) => {
  let { mode, value, revised_value, document, template, attribute, reviseDocument } = props;

  if (attribute.options) return <SelectAttribute {...props} />;
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
)(StringAttribute);

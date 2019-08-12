import { connect } from 'react-redux';

import { reviseDocument } from '../../actions/magma_actions'
import React, { Component } from 'react';
import TextAreaInput from '../inputs/text_area_input';

const TextAttribute = ({ mode, value, revised_value,
  document, template, attribute, reviseDocument }) => {
  if (mode != 'edit') return <div className='attribute'> { value } </div>;

  return <div className='attribute'>
    <TextAreaInput
      defaultValue={ revised_value }
      className='text_box'
      onChange={ (value) => reviseDocument(document,template,attribute,value) }
    />
  </div>;
}

export default connect(
  null,
  {reviseDocument}
)(TextAttribute);

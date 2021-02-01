import { connect } from 'react-redux';

import { reviseDocument } from 'etna-js/actions/magma_actions';
import React, { Component } from 'react';
import { IntegerInput, FloatInput } from 'etna-js/components/inputs/numeric_input';

let NumericAttribute = ({ mode, value, revised_value,
  document, template, attribute, reviseDocument, NumericInput }) => {
  if (mode != 'edit') return <div className='attribute'> { value } </div>;

  return <div className='attribute'>
    <NumericInput
      onChange={ value => reviseDocument( document, template, attribute, value ) }
      className='full_text'
      placeholder={attribute.placeholder}
      defaultValue={ revised_value } />
  </div>;
}

NumericAttribute = connect(
  null,
  { reviseDocument }
)(NumericAttribute);

export const IntegerAttribute = (props) => <NumericAttribute {...props } NumericInput={ IntegerInput }/>;
export const FloatAttribute = (props) => <NumericAttribute {...props } NumericInput={ FloatInput }/>;

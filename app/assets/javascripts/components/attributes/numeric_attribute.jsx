import { connect } from 'react-redux';

import { reviseDocument } from '../../actions/magma_actions';
import React, { Component } from 'react';
import { IntegerInput, FloatInput } from '../inputs/numeric_input';

class NumericAttribute extends Component {
  render() {
    let { mode, value } = this.props;

    return <div className='value'>
      {
        mode == 'edit' ? this.renderInput() : value
      }
    </div>;
  }

  onChange(value) {
    let { document, template, attribute, reviseDocument } = this.props;

    reviseDocument(
      document, template, attribute, value
    );
  }

  renderInput() {
    let { numericInput, revision, attribute } = this.props;

    return <numericInput 
        onChange={ this.onChange.bind(this) }
        className='full_text'
        placeholder={attribute.placeholder}
        defaultValue={ revision } />;
  }
}

NumericAttribute = connect(
  null,
  { reviseDocument }
)(NumericAttribute);

export const IntegerAttribute = (props) => <NumericAttribute {...props } numericInput={ IntegerInput }/>;
export const FloatAttribute = (props) => <NumericAttribute {...props } numericInput={ FloatInput }/>;

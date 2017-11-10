import { connect } from 'react-redux';

import { reviseDocument } from '../../actions/magma_actions';
import React, { Component } from 'react';
import { IntegerInput, FloatInput } from '../inputs/numeric_input';

const NumericAttribute = (Input) => {
  return class extends Component {
    render() {
      let {mode, value} = this.props;

      return <div className='value'>
        {
          mode == 'edit' ? this.renderInput() : value
        }
      </div>;
    }

    onChange(value) {
      let {document, template, attribute, reviseDocument} = this.props;

      reviseDocument(
        document, template, attribute, value
      );
    }

    renderInput() {
      let {revision, attribute} = this.props;

      return <Input
        onChange={ this.onChange.bind(this) }
        className='full_text'
        placeholder={attribute.placeholder}
        defaultValue={ revision }/>;
    }
  };
};

export const IntegerAttribute = connect(
  null,
  { reviseDocument }
)(NumericAttribute(IntegerInput));

export const FloatAttribute = connect(
  null,
  { reviseDocument }
)(NumericAttribute(FloatInput));
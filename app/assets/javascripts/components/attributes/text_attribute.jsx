import { connect } from 'react-redux';

import { reviseDocument } from '../../actions/magma_actions'
import React, { Component } from 'react';
import TextAreaInput from '../inputs/text_area_input';

class TextAttribute extends Component {
  renderEdit() {
    let { revision, document, template, attribute, reviseDocument } = this.props;
    return <TextAreaInput
      defaultValue={ revision }
      className='text_box'
      onChange={ (value) => reviseDocument(document,template,attribute,value) }
    />;
  }

  render() {
    let { mode, value } = this.props;
    return <div className="value">
      { mode == 'edit' ? this.renderEdit() : value }
    </div>
  }
}

export default connect(
  null,
  {reviseDocument}
)(TextAttribute);

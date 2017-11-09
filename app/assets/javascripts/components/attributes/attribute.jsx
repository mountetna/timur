import { connect } from 'react-redux';

import { reviseDocument } from '../../actions/magma_actions';
import React, { Component } from 'react';
import SlowTextInput from '../inputs/slow_text_input';

class Attribute extends Component {
  renderEdit() {
    let { document, template, attribute, revision, reviseDocument } = this.props;
    return <SlowTextInput 
      className='full_text' 
      placeholder={ attribute.placeholder }
      onChange={ (value) => { reviseDocument( document, template, attribute, value) } }
      defaultValue={ revision } />;
  }

  render() {
    let { mode, value } = this.props;

    return <div className='value'>
      { mode == 'edit' ? this.renderEdit() : value }
    </div>;
  }
}

export default connect(
  null,
  {reviseDocument}
)(Attribute);

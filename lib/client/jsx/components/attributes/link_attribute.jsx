
// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

import { reviseDocument } from '../../actions/magma_actions';
import SlowTextInput from '../inputs/slow_text_input';
import MagmaLink from '../magma_link';

class LinkAttribute extends React.Component{
  setLink(value) {
    let { document, template, attribute, reviseDocument } = this.props;

    reviseDocument(
      document,
      template,
      attribute,
      value
    );
  }

  removeLink(e) {
    let { document, template, attribute, reviseDocument } = this.props;

    reviseDocument(
      document,
      template,
      attribute,
      null
    );
  }

  renderEdit(){
    let { revision, value } = this.props;

    if (revision && revision == value) {
      return(
        <div className='value'>
          <span className='delete_link'
            onClick={ this.removeLink.bind(this) }>
            {revision}
          </span>
        </div>
      );
    }

    return(
      <div className='value'>
        <SlowTextInput
          className='link_text'
          waitTime={500}
          onChange={ this.setLink.bind(this) }
          placeholder='New or existing ID' />
      </div>
    );
  }

  render(){
    let { mode, attribute, value } = this.props;

    if (mode == 'edit') return this.renderEdit();

    if(value){
      return(
        <div className='value'>
          <MagmaLink link={value} model={ attribute.model_name } />
        </div>
      );
    }

    return <div className='value'/>;
  }
}

export default connect(
  null,
  { reviseDocument }
)(LinkAttribute);

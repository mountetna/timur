// Framework libraries.
import * as React from 'react';

import { connect } from 'react-redux';
import { reviseDocument } from '../../actions/magma_actions';

class DocumentAttribute extends React.Component{
  revise(e) {
    let { document, template, attribute, reviseDocument } = this.props;

    reviseDocument(
      document,
      template,
      attribute,
      e.target.files[0]
    )
  }
  renderEdit(){
    let input_props = {
      onChange: this.revise.bind(this),
      type:"file"
    };

    return(
      <div className="value">
        <input {...input_props}/>
      </div>
    )
  }

  render(){
    let { mode, value } = this.props;

    if (mode == "edit") return this.renderEdit();

    if (value){
      return(
        <div className="value">
          <a href={ value.url } > { value.path } </a>
        </div>
      );
    }

    return(
      <div className="value">
        <div className="document_empty">
          No file.
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  { reviseDocument }
)(DocumentAttribute);

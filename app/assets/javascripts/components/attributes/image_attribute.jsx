// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import { reviseDocument } from '../../actions/magma_actions';

class ImageAttribute extends React.Component{
  renderEdit(){
    let { document, template, attribute, reviseDocument } = this.props;
    let input_props = {
      onChange: (e) => reviseDocument(
        document,
        template,
        attribute,
        e.target.files[0]
      ),
      type:"file"
    };

    return(
      <div className="value">
        <input {...input_props} />
      </div>
    );
  }

  render(){
    let { mode, value } = this.props;
    if (mode == "edit") return this.renderEdit();

    if (value){
      return(
        <div className="value">
          <a href={ value.url } >
            <img src={ value.thumb }/>
          </a>
        </div>
      );
    }

    return(
      <div className="value">
        <div className="document_empty">No file.</div>
      </div>
    );
  }
}

export default ReactRedux.connect(
  null,
  {reviseDocument}
)(ImageAttribute);

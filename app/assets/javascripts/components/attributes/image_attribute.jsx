// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import * as MagmaActions from '../../actions/magma_actions';

export default class ImageAttribute extends React.Component{
  renderEdit(){
    let store = this.context.store;
    let self = this;
    let input_props = {
      onChange:function(e) {
        store.dispatch(reviseDocument(
          self.props.document,
          self.props.template,
          self.props.attribute,
          e.target.files[0]))
      },
      type:"file"
    };

    return(
      <div className="value">
        <input {...input_props} />
      </div>
    );
  }

  render(){
    let self = this;
    let store = this.context.store
    if (this.props.mode == "edit") return this.renderEdit();
    
    if (this.props.value){
      return(
        <div className="value">
          <a href={ this.props.value.url } >
            <img src={ this.props.value.thumb }/>
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

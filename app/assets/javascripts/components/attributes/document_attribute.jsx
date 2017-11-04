import React, { Component } from 'react';

import { reviseDocument } from '../../actions/magma_actions'

var DocumentAttribute = React.createClass({
  render: function() {
    var self = this
    var store = this.context.store
    var link = this.props.value
    if (this.props.mode == "edit") {
      return <div className="value">
               <input onChange={
                 function(e) {
                   store.dispatch(reviseDocument(
                     self.props.document,
                     self.props.template,
                     self.props.attribute,
                     e.target.files[0]))
                 }
               }
               type="file"/>
             </div>
    }
    if (link) {
      return <div className="value">
              <a href={ link.url } > { link.path } </a>
             </div>
    }
    return <div className="value"> <div className="document_empty">No file.</div> </div>
  }
})
DocumentAttribute.contextTypes = {
  store: React.PropTypes.object
}

module.exports = DocumentAttribute

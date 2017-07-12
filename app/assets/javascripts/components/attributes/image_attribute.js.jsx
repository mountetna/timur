import { reviseDocument } from '../../actions/magma_actions'

var ImageAttribute = React.createClass({
  render: function() {
    var self = this
    var store = this.context.store
    if (this.props.mode == "edit") {
      return <div className="value">
               <input
                 onChange={
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

    if (this.props.value)
      return <div className="value">
              <a href={ this.props.value.url } >
                <img src={ this.props.value.thumb }/></a>
             </div>
    else
      return <div className="value">
              <div className="document_empty">No file.</div>
             </div>
  }
})
ImageAttribute.contextTypes = {
  store: React.PropTypes.object
}

module.exports = ImageAttribute

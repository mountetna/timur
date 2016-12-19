var magma_documents = function( state, model_name, record_names) {
  if (!state.models[model_name]) return [];
  return record_names.map(function(record_name) {
    return state.models[model_name].documents[record_name]
  }).filter(function(doc) { return doc != undefined })
}

var TableWidget = React.createClass({
  render: function() {
    return <div className="value">
        <TableViewer page_size={ this.props.page_size }
          mode={ this.props.mode }
          table={ this.props.table } />
      </div>
  }
})


var TableAttribute = connect(
  function(state, props) {
    model_name = props.attribute.name
    template = state.models[model_name] ? state.models[model_name].template : null
    documents = magma_documents( state, model_name, props.value )
    var table = template ? TableSet(documents, template) : null
    return {
      page_size: 10,
      mode: props.mode,
      table: table
    }
  }
)(TableWidget)

module.exports = TableAttribute

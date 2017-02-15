var magma_documents = function( state, model_name, record_names) {
  if (!state.templates[model_name]) return [];
  return record_names.map(function(record_name) {
    return state.templates[model_name].documents[record_name]
  }).filter(function(doc) { return doc != undefined })
}

var TableAttribute = React.createClass({
  render: function() {
    return <div className="value">
        <TableViewer page_size={ this.props.page_size }
          mode={ this.props.mode }
          table={ this.props.table } />
      </div>
  }
})

TableAttribute = connect(
  function(state, props) {
    var model_name = props.attribute.model_name
    var template = state.templates[model_name] ? state.templates[model_name].template : null
    var documents = magma_documents( state, model_name, props.value )
    var table = template ? new TableSet(documents, template) : null
    return {
      page_size: 10,
      mode: props.mode,
      table: table
    }
  }
)(TableAttribute)

module.exports = TableAttribute

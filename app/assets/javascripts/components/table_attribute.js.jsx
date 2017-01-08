var magma_documents = function( model, record_names) {
  if (!model) return [];
  return record_names.map(function(record_name) {
    return model.documents[record_name]
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
    var model_name = props.attribute.name
    var model = state.magma.models[model_name]
    var template = model ? model.template : null
    var documents = magma_documents( model, props.value )
    var table = template ? TableSet(documents, template) : null
    return {
      page_size: 10,
      mode: props.mode,
      table: table
    }
  }
)(TableAttribute)

module.exports = TableAttribute

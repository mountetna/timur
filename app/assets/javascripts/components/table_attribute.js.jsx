var magma_records = function( state, model_name, record_names) {
  return record_names.map(function(record_name) {
    state.templates[model_name] ? state.templates[model_name].documents[record_name] : null
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
    template = state.templates[model_name] ? state.templates[model_name].template : null
    documents = magma_records( state, model_name, props.value )
    var table = template ? TableSet(documents, template) : null
    return {
      page_size: 10,
      mode: props.mode,
      table: table
    }
  }
)(TableWidget)

module.exports = TableAttribute

import Magma from 'magma'

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
    var magma = new Magma(state)
    var template = magma.template(model_name)
    var documents = magma.documents( model_name, props.value )
    var table = template ? new TableSet(documents, template) : null
    return {
      page_size: 10,
      mode: props.mode,
      table: table
    }
  }
)(TableAttribute)

module.exports = TableAttribute

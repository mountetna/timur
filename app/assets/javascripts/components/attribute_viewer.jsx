var AttributeViewer = React.createClass({
  render: function() {
    var class_name = this.props.attribute.attribute_class
    var AttClass = eval(class_name)
    return <AttClass 
              document={ this.props.document }
              template={ this.props.template }
              value={ this.props.value }
              revision={ this.props.revision }
              mode={ this.props.mode }
              attribute={ this.props.attribute }/>
  }
})

module.exports = AttributeViewer

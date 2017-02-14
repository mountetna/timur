AttributeViewer = React.createClass({
  render: function() {
    var attribute = this.props.attribute
    var class_name = attribute.attribute_class

    var AttClass

    switch(class_name) {
      case "BarPlotAttribute":
        AttClass = BarPlotAttribute
        break
      case "BoxPlotAttribute":
        AttClass = BoxPlotAttribute
        break
      case "TextAttribute":
        AttClass = TextAttribute
        break
      case "LinePlotAttribute":
        AttClass = LinePlotAttribute
        break
      case "MarkdownAttribute":
        AttClass = MarkdownAttribute
        break
      case "MetricsAttribute":
        AttClass = MetricsAttribute
        break
      case "Magma::CollectionAttribute":
        AttClass = CollectionAttribute
        break
      case "Magma::ForeignKeyAttribute":
      case "Magma::ChildAttribute":
        AttClass = LinkAttribute
        break
      case "Magma::TableAttribute":
        AttClass = TableAttribute
        break
      case "Magma::DocumentAttribute":
        AttClass = DocumentAttribute
        break
      case "Magma::ImageAttribute":
        AttClass = ImageAttribute
        break
      case "Magma::Attribute":
        if (attribute.options) {
          AttClass = SelectAttribute
        }
        else {
          switch(attribute.type) {
            case "TrueClass":
              AttClass = CheckboxAttribute
            case "Integer":
              AttClass = IntegerAttribute
            case "Float":
              AttClass = FloatAttribute
            case "DateTime":
              AttClass = DateTimeAttribute
            default:
              AttClass = Attribute
          }
        }
        break
      default:
        throw "Could not match attribute " + attribute.name + " with class " + class_name + " to a display class!"
    }
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

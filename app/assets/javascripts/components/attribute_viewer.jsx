var AttributeViewer = React.createClass({
  render: function() {
    var attribute = this.props.attribute
    var class_name = attribute.attribute_class

    var AttClass

    switch(class_name) {
      case "BarPlotAttribute"
        AttClass = BarPlotAttribute
      case "BoxPlotAttribute"
        AttClass = BoxPlotAttribute
      case "Magma::CollectionAttribute"
        AttClass = CollectionAttribute
      case "Magma::ForeignKeyAttribute"
      case "Magma::ChildAttribute"
        AttClass = LinkAttribute
      case "Magma::TableAttribute"
        AttClass = TableAttribute
      case "Magma::DocumentAttribute"
        AttClass = DocumentAttribute
      case "Magma::ImageAttribute"
        AttClass = ImageAttribute
      case "Magma::Attribute"
        if att[
        AttClass = CheckboxAttribute
        AttClass = DateTimeAttribute
        AttClass = FloatAttribute
        AttClass = IntegerAttribute
        AttClass = TextAttribute
        AttClass = SelectAttribute

        AttClass = LinePlotAttribute
        AttClass = MarkdownAttribute
        AttClass = MetricsAttribute
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

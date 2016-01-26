TableAttribute = React.createClass({
  mixins: [ AttributeHelpers ],
  render: function() {
    var self = this;
    // the raw table is in the attribute value, which is a list of
    var table = TableSet(this.attribute_value());

    return <div className="value">
      <TableViewer page_size={ 10 }
        mode={ this.props.mode } table={ table } />
    </div>
  },
});

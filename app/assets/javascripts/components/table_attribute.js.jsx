TableAttribute = React.createClass({
  mixins: [ AttributeHelpers ],
  render: function() {
    var self = this;
    // the raw table is in the attribute value, which is a list of
    var table = this.attribute_value();
    // filter to shown columns
    var columns = Object.keys(table.model.attributes).map(function(att_name) {
      var column = new TableColumn(table.model.attributes[att_name]);
      if (!column.shown) return null;
      return column;
    }).filter(function(column) { return column != undefined });

    var show_table = {
      columns: columns,
      records: table.records
    }
    return <div className="value">
      <TableViewer page_size={ 10 }
        mode={ this.props.mode } table={ show_table } />
    </div>
  },
});

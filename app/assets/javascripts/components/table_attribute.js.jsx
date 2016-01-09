TableAttribute = React.createClass({
  mixins: [ AttributeHelpers ],
  render: function() {
    var self = this;
    return <div className="value">
      <TableViewer page_size={ 10 }
        mode={ this.props.mode } table={ this.attribute_value() } />
    </div>
  },
});

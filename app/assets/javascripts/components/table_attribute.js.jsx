TableAttribute = React.createClass({
  render: function() {
    var self = this;
    var table = TableSet(this.props.value);

    return <div className="value">
      <TableViewer page_size={ 10 }
        mode={ this.props.mode }
        table={ table } />
    </div>
  },
})

module.exports = TableAttribute

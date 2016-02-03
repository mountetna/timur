ListSelector = React.createClass({
  getInitialState: function() {
    return { selected_items: [] }
  },
  delete_item: function(i) {
    var self = this;
    var items = this.state.selected_items.slice(0);
    items.splice(i,1);
    this.setState( { selected_items: items }, function() {
      if (self.props.onChange) self.props.onChange(self.state.selected_items);
    });
  },
  add_item: function() {
    var self = this;
    this.setState( { selected_items: this.state.selected_items.concat(this.state.new_item) }, function() {
      if (self.props.onChange) self.props.onChange(self.state.selected_items);
    });
  },
  set_new_item: function(item) {
    this.setState({ new_item: item });
  },
  render: function() {
    var self = this;
    return <div className="list">
      <span className="label">{ this.props.label }</span>
      {
        this.state.selected_items.map(function(item,i) {
          return <span key={ i } onClick={ self.delete_item.bind(self, i) } className="item">{ self.props.values[item].name };</span>
        })
      }
      <Selector showNone="enabled" values={ $.map(this.props.values, function(item) {
          return {
            key: item.key,
            value: item.key,
            text: item.name
          }
          }) }
          onChange={ this.set_new_item } />
      <input type="button" onClick={ this.add_item } value="Add" />
    </div>
  }
});

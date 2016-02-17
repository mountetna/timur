var ListSelector = React.createClass({
  getInitialState: function() {
    return { new_item: null }
  },
  delete_item: function(i) {
    var items = this.props.currentSelection.slice(0);
    items.splice(i,1);
    this.props.onChange(items);
  },
  add_item: function() {
    this.props.onChange(
      this.props.currentSelection.concat(this.state.new_item)
    );
  },
  set_new_item: function(item) {
    this.setState({ new_item: item });
  },
  render_current: function() {
    var self = this;
    if (Array.isArray(this.props.limits)) {
      console.log(this.props.limits);
      return this.props.limits.map(function(varname,i) {
        var item = self.props.currentSelection[i];
        var selection;
        if (!item)
          selection = <span className="warning">none</span>;
        else
          selection = <span
            onClick={ self.delete_item.bind(self, i) }
            className="itemname">{ self.props.values[item].name }</span>

        return <div className="item" key={ i }>
          <span className="varname">{ varname }</span>
          {
            selection
          }
        </div>;
      });
    }
    else if (this.props.limits == "any") {
      if (this.props.currentSelection.length == 0)
        return <div className="item">
          <span className="warning">none</span>
        </div>;

      return this.props.currentSelection.map(function(item,i) {
        return <div className="item" key={ i }>
          <span onClick={ self.delete_item.bind(self, i) }
            className="itemname">{ self.props.values[item].name }</span>
          </div>;
      })
    }
  },
  render_selector: function() {
    var self = this;
    if (Array.isArray(this.props.limits) 
        && this.props.limits.length == this.props.currentSelection.length) {
          return null;
    }
    return <div className="selector">
       <Selector showNone="enabled" values={ $.map(this.props.values, function(item) {
          return {
            key: item.key,
            value: item.key,
            text: item.name
          }
          }) }
          onChange={ this.set_new_item } />
      <input type="button" 
        disabled={ this.state.new_item == null }
        onClick={ this.add_item }
        value="Add" />
    </div>;
  },
  render_label: function() {
    if (Array.isArray(this.props.limits)) return null;
    return <span className="label">{ this.props.label }</span>
  },
  render: function() {
    var self = this;
    return <div className="list">
      {
        this.render_label()
      }
      {
        this.render_current()
      }
      {
        this.render_selector()
      }
    </div>
  }
});
ListSelector.propTypes = {
  onChange: React.PropTypes.func.isRequired
};

module.exports = ListSelector;

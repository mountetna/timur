var ChainSelector = React.createClass({
    // okay, what have we here? A 'Chain Selector' is one that shows a chain of widgets, adding the next
    // one based on the choice of the current. So, no need to show the subsequent ones until you know what
    // it should show
    // Operationally, each one of the elements in the chain will set the current STATE showing what the value
    // is. Based on this state of values, the chain will be rendered. The chain then gives a full account of its state.
    // for element, we must have a mapping from the selected state to the valid choices for the next element in the chain.
    // E.g., if the chain goes:
    // indication => clinical
    // then we have to have a mapping for valid choices for 'clinical' (i.e., any clinical variable) for that indication.
    // So the input data structure should look like this:
    // {
    //   element: indication
    //   values: {
    //     # we can get a two-for-one here by including the mapping to the next guy.
    //     'indication1' : [ 'clinical1', 'clinical2', etc. ]
    //     'indication2' : [ 'clinical1', 'clinical3', etc. ]
    //   }
    // }
  current_values: function() {
    if (!this.props.depends) return this.props.values;
    var self = this;
    var values = this.props.depends.reduce(function(values,depend) {
      if (values)
        return values[self.props.chain_state[ depend ]];
      else
        return null
    }, this.props.values);
    if (!values) return [];
    values = Array.isArray(values) ? values : Object.keys(values);
    if (this.props.formatter)
      values = values.map(this.props.formatter);
    return values;
  },
  should_show: function() {
    return this.current_values().length > 0
  },
  change: function(value) {
    this.props.change( this.props.name, value );
  },
  render: function() {
    // only show if you don't have any dependencies
    if (this.should_show()) {
      return <div className="chain_selector">
        <span className="label">{ this.props.label }</span>
        <Selector name={ this.props.name } values={ this.current_values() } //, 'MFI', 'Clinical variable' ] }
                onChange={ this.change } 
                showNone={ this.props.showNone }
                defaultValue={ this.props.defaultValue }>
        </Selector>
      </div>;
    }
    else
      return <div className="chain_selector empty"></div>;
  },
})

module.exports = ChainSelector;

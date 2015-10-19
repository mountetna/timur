PlotSeries = React.createClass({
  getInitialState: function() {
    return { chain_state: {} }
  },
  render_indication: function() {
    if (!this.props.series) return <span>undefined</span>;
    return <span> Indication: { this.props.series.indication }</span>;
  },
  render: function() {
    var self = this;
    if (this.props.mode == 'plot')
      return <div className="series">
          <span className="title">Series</span>
          { this.render_indication() }
        </div>;
    else {
      return <div className="series edit">
            <span className="title">Series</span>
            <ColorPicker label="Color" onChange={ this.update_color }/>
            <ChainSelector name="indication"
                label="Indication"
                change={ this.update_chain }
                values={ this.props.template.indications }
                showNone="disabled"
                chain_state={ this.state.chain_state }/>
            <ChainSelector
                name="clinical_name"
                label="Clinical Variable"
                depends={ [ "indication" ] }
                values={ this.props.template.clinicals }
                change={ this.update_chain }
                showNone="enabled"
                chain_state={ this.state.chain_state } />
            <ChainSelector
                name="clinical_value"
                label="Value"
                showNone="disabled"
                depends={ [ "indication", "clinical_name" ] }
                values={ this.props.template.clinicals }
                change={ this.update_chain }
                chain_state={ this.state.chain_state } />
          </div>;
    }
  },
  update_color: function(color) {
    console.log(color.toRgbString());
    this.update_chain('color', color.toRgb());
  },
  update_chain: function(name, value) {
    console.log(value);
    current_chain = this.state.chain_state;
    current_chain[ name ] = value;
    this.setState({ chain_state: current_chain });
  },
  update_series: function() {
    var node = $(React.findDOMNode(this));
    this.props.update_series({
      indication: node.find('select[name=indication]').val()
    });
  }
})

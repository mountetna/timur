PlotSeries = React.createClass({
  getInitialState: function() {
    return { full_state: {} }
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
            <ChainSelector name="indication"
                onChange={ this.update_chain }
                values={ this.props.template.indications }
                chain_state={ this.state.full_state }/>
            <ChainSelector
                name="clinical"
                depends="indication"
                values={ this.props.template.clinical }
                onChange={ this.update_chain }
                chain_state={ this.state.full_state } />
            <ChainSelector
                name="colors"
                values={ Object.keys(self.props.template.colors).map(function(color) {
                  return  {
                    key: color,
                    name: color,
                    text: <span style={ { 'background-color': self.props.template.colors[color] } }>###</span>
                  };
                }) }
                onChange={ this.update_chain }
                chain_state={ this.state.full_state } />
          </div>;
    }
  },
  update_chain: function(payload) {
  },
  update_series: function() {
    var node = $(React.findDOMNode(this));
    this.props.update_series({
      indication: node.find('select[name=indication]').val()
    });
  }
})

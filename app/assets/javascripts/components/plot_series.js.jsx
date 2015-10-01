PlotSeries = React.createClass({
  render_indication: function() {
    if (!this.props.series) return <span>undefined</span>;
    return <span> Indication: { this.props.series.indication }</span>;
  },
  render: function() {
    var vars = [
      {
        name: 'indication'
      },
      {
        name: 'clinical',
        prerequisite: 'indication'
      },
    ]
    if (this.props.mode == 'plot')
      return <div className="series">
          <span className="title">Series</span>
          { this.render_indication() }
        </div>;
    else {
      return <div className="series edit">
            <span className="title">Series</span>
            <ChainSelector item="indication"
                variables={ vars }
                selection={ this.state.selection } 
                chain={ [ 'stain', 'population' ] }
                choices={ this.props.template.series } onUpdate={ this.update_chain }/>
            <ChainSelector item="clinical" chain={ this.state.chain } selections={ this.props.template.series } onUpdate={ this.update_chain }/>
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

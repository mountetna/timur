BoxPlot = React.createClass({
  render: function() {
    var self = this;
    return <div className="scatter plot">
      <Header mode={ this.state.mode } handler={ this.header_handler } can_edit={ true } can_close={ true }>
        { this.props.plot.name }
      </Header>
      <BoxPlotConfigure mode={ this.state.mode }/>
      <svg className="scatter_plot" width="800" height="350">
        {
          this.plot_data.mappings.map(function(mapping) {
            return <WhiskerBox name={ mapping.name } values={ this.plot_data.matrix.row_vector(i) }/>
          })
        }
      </svg>
    </div>;
  },
});

BoxPlotConfigure = React.createClass({
  render: function() {
    if (this.props.mode == 'plot') return null;

    return <div className="configure">
      <SeriesSelector/>
        <Selector showNone="disabled" name="series" 
          values={ $.map(this.props.saves.series,this.mapping_map) }/>
        Mappings:
        
        <Selector showNone="disabled" name="x" onChange={ this.set_mapping } 
          values={ $.map(this.props.saves.mappings,this.mapping_map) }/>
        </div>
      </div>
  }
});


WhiskerBox = React.createClass({
  render: function() {
    var bounds = this.calculate_bounds();

    return <g className="box" transform={ 'translate(' + this.props.x + ',' + this.props.y +')' } >
      // center line
      <line
        className="center"
        x1={ this.props.width / 2 }
        x2={ this.props.width / 2 }
        y1={ bounds.min }
        y2={ bounds.max } />

      // innerquartile box
      <rect
        className="box"
        x="0"
        y={ bounds.quartile_min }
        width={ this.props.width }
        height={ bounds.quartile_max - bounds.quartile_min }/>

      // median line
      <line
        className="median"
        x1="0"
        x2={ this.props.width }
        y1={ bounds.quartile_mid }
        y2={ bounds.quartile_mid } />

      // whiskers
      <line
        className="whisker"
        x1="0"
        x2={ this.props.width }
        y1={ bounds.quartile_min }
        y2={ bounds.quartile_min } />

      // outliers

    </g>
  }
});

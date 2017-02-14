var BoxPlot = React.createClass({
  render: function() {
    var self = this;
    return <div className="scatter plot">
      <Header mode={ this.state.mode } handler={ this.header_handler } can_edit={ true } can_close={ true }>
        { this.props.plot.name }
      </Header>
      <BoxPlotConfigure mode={ this.state.mode } plot_id={ this.props.plot_id }/>
      <svg className="scatter_plot" width="800" height="350">
        {
          this.plot_data.mappings.map(function(mapping) {
            return <WhiskerBox name={ mapping.name } values={ this.plot_data.matrix.row_vector() }/>
          })
        }
      </svg>
    </div>;
  },
});

var BoxPlotConfigure = React.createClass({
  render: function() {
    if (this.props.mode == 'plot') return null;

    return <div className="configure">
        <Selector showNone="disabled" name="series" 
          values={ this.props.saved_series }/>
        Mappings:
        
        <Selector showNone="disabled" name="x" 
          values={ this.props.saved_mappings }/>
      </div>
  }
});


var WhiskerBox = React.createClass({
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

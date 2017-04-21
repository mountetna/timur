var XAxis = React.createClass({
  render: function() {
    var self = this;
    var scale = this.props.scale;
    var ticks = scale.ticks(this.props.num_ticks);
    var interval_size = ticks[1] - ticks[0];
    var places = Math.ceil(-Math.log10(Math.abs(interval_size)));
    places = places < 0 ? 0 : places

    return <g className="axis">
      <text textAnchor="middle" transform={ 'translate(' + (scale(this.props.xmin)+scale(this.props.xmax))/2 + ',' + (this.props.y + 35) + ')' }>
        { this.props.label }
      </text>
      <line 
            y1={ this.props.y }
            x1={ scale(this.props.xmin) }
            y2={ this.props.y }
            x2={ scale(this.props.xmax) }/>
      {
        ticks.map(function(tick,i) {
          var x = self.props.scale(tick)
          var format_tick

          if (typeof tick == "number")
            format_tick = tick.toFixed(places)
          else if (tick instanceof Date)
            format_tick = scale.tickFormat()(tick)
          else
            format_tick = tick

          return <g key={i}>
              <text textAnchor="middle" 
                transform={ 
                  'translate(' + x + ',' + (self.props.y + self.props.tick_width + 10) + ')' }>
                    { 
                      format_tick
                    }
              </text>
              <line y1={ self.props.y }
                  x1={ x }
                  y2={ self.props.y + self.props.tick_width }
                  x2={ x }/>
            </g>
        })
      }
    </g>;
  }
});

module.exports = XAxis;

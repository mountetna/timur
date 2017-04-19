// expects:
//   scale = d3 scale object
//   ymin = lowest value in coordinate space
//   ymax = highest value in coordinate space
//   x = x position of axis
//   num_ticks = approximate number of ticks
//   tick_width = width of the tick in pixels

var YAxis = React.createClass({
  render: function() {
    var self = this;
    var scale = this.props.scale;
    var ticks = scale.ticks(this.props.num_ticks);
    var interval_size = ticks[1] - ticks[0];
    var places = Math.abs(Math.ceil(-Math.log10(Math.abs(interval_size))));
    return <g className="axis">
      <text textAnchor="middle" transform={ 'translate(-45,' + (scale(this.props.ymin)+scale(this.props.ymax))/2 + ') rotate(-90)' }>
        { this.props.label }
      </text>
      <line 
            x1={ this.props.x }
            y1={ scale(this.props.ymin) }
            x2={ this.props.x }
            y2={ scale(this.props.ymax) }/>
      {
        ticks.map(function(tick,i) {
          var y = self.props.scale(tick);

          var format_tick
          if (typeof tick == "number")
            format_tick = tick.toFixed(places)
          else if (tick instanceof Date)
            format_tick = scale.tickFormat()(tick)
          else
            format_tick = tick
          return <g key={i}>
              <text textAnchor="end" 
                transform={ 
                  'translate(' + (self.props.x - self.props.tick_width - 2) + ',' + (y + 2) + ')' }>
                    {
                      format_tick
                    }
              </text>
              <line x1={ self.props.x }
                  y1={ y }
                  x2={ self.props.x - self.props.tick_width }
                  y2={ y }/>
            </g>
        })
      }
    </g>;
  }
});

module.exports = YAxis;

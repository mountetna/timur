BarPlot = React.createClass({
  getInitialState: function() {
    return { zoom: 1 }
  },
  onWheel: function(event) {
    var zoom = this.state.zoom;
    event.preventDefault();

    if (event.deltaY > 0)
      zoom = zoom * 0.8;
    else
      zoom = zoom * 1.2;
    if (zoom < 1e-6)
      zoom = 1e-6;
    if (zoom > 1)
      zoom = 1;
    this.setState({ zoom: zoom });
  },
  render: function() {
    var self = this;
    var plot = this.props.plot;
    var margin = plot.margin,
        width = plot.width - margin.left - margin.right,
        height = plot.height - margin.top - margin.bottom;

    var zoom_ymax = this.state.zoom * this.props.ymax;

    var yScale = d3.scale.linear()
      .domain( [ this.props.ymin, 
          zoom_ymax ] )
      .range([ height, 0 ]);

    return <svg 
      id={ this.props.plot.name }
      className="bar_plot" 
      width={ this.props.plot.width }
      height={ this.props.plot.height }>
      <Plot 
        onWheel={ this.onWheel }
        x={ margin.left } y={ margin.top }
        width={ width }
        height={ height }>
      <YAxis x={ -3 }
        scale={ yScale }
        ymin={ this.props.ymin }
        ymax={ zoom_ymax }
        num_ticks={5}
        tick_size={ 5 }/>
      <XAxis />
      <Legend x={ width - margin.right - 30 } y="0" series={ this.props.legend }/>
      {
        this.props.data.map(function(datum,i) {
          return <Bar series={ datum.series }
                  color={ datum.color }
                  ymax={ zoom_ymax }
                  ymin={ self.props.ymin }
                  width={ 20 }
                  scale={ yScale }
                  x={ 10 + i * 30 }
                  height={ datum.height }
                  mouse_handler={ self.highlight_dot_mouseover }
                  highlighted_dot_name={ self.state.highlighted_dot_name }
                  dots={ datum.dots } />
        })
      }
      </Plot>
    </svg>
  },
  highlight_dot_mouseover: function(dot_name) {
    this.setState( { highlighted_dot_name: dot_name } );
  }
});

Plot = React.createClass({
  render: function() {
    return <g className="plot" 
            onWheel={ this.props.onWheel }
            transform={ 'translate(' + this.props.x + ',' + this.props.y + ')' }>
              <rect x="0" y="0" width={ this.props.width }
                height={ this.props.height }
                style={ { fill: 'white' } }/>
      {
        this.props.children
      }
    </g>
  }
});

Bar = React.createClass({
  render_dots: function() {
    var self = this;
    if (!this.props.dots) return null;

    return this.props.dots.map( function(dot) {
      return <Dot name={ dot.name } 
        mouse_handler={ self.props.mouse_handler }
        x={ self.props.x + self.props.width / 2  + ((1000*dot.height) %8) - 4} 
        y={ self.props.scale(dot.height) }
        highlighted_dot_name={ self.props.highlighted_dot_name }
       />
    });
  },
  render: function() {
    return <g className="bar">
      {
        this.render_dots()
      }
      <rect
        x={ this.props.x }
        y={ this.props.scale( this.props.height ) - this.props.scale(this.props.ymax) }
        width={ this.props.width }
        style={ { stroke: (this.props.color || "white") } }
        height={ this.props.scale(this.props.ymin) - this.props.scale( this.props.height ) }/>
      <text textAnchor="start" 
        transform={ 
          'translate('+this.props.x+',' +
              (this.props.scale(this.props.ymin) + 15)+') rotate(45)'
        }>
            { this.props.series }
      </text>
    </g>
  }
});

YAxis = React.createClass({
  calculate_tick_label: function(tick) {
      var interval_size = (this.props.ymin - this.props.ymax)/this.props.num_ticks;
      var value = this.props.ymax + tick * interval_size;
      var places = Math.ceil(-Math.log10(Math.abs(interval_size))) + 1;
      console.log(interval_size);

      return value.toFixed(places);
  },
  render: function() {
    var self = this;
    var ticks = []
    var tick;
    var y1 = this.props.scale(this.props.ymin);
    var y2 = this.props.scale(this.props.ymax);
    for (tick = 0; tick <= self.props.num_ticks; tick++) {
      var y = y2 + tick*(y1-y2) / self.props.num_ticks;
      var ylabel = this.calculate_tick_label(tick);

      ticks.push(
        <g>
          <text textAnchor="end" 
            transform={ 
              'translate(' + (this.props.x - self.props.tick_size - 2) + ',' + (y + 2) + ')' }>
                { ylabel }
          </text>
          <line x1={ self.props.x }
              y1={ y }
              x2={ self.props.x - self.props.tick_size }
              y2={ y }/>
        </g>
      );
    }
    return <g className="axis">
      <line 
            x1={ this.props.x }
            y1={ y1 }
            x2={ this.props.x }
            y2={ y2 }/>
      {
        ticks
      }
    </g>;
  }
});


XAxis = React.createClass({
  render: function() {
    return <div></div>;
  }
});

Legend = React.createClass({
  render: function() {
    return <g className="legend" height="100" width="100" 
       transform={ 'translate(' + this.props.x + ',' + this.props.y + ')' }>
      {
        this.props.series.map(function(series,i) {
          return <g>
            <rect x="0" y={ 10 + i * 20 }
              width="10" height="10"
              style={{fill: series.color }}/>
            <text textAnchor="start"
              x="15"
              y={ 20 + i * 20 }>
              { series.name }
            </text>
          </g>
        })
      }
    </g>
  }
});

Dot = React.createClass({
  getInitialState: function() {
    return { highlighted: false }
  },
  onMouseOver: function(event) {
    // draw tooltip 
    this.setState( { highlighted: true } )
    this.props.mouse_handler( this.props.name );
  },
  onMouseOut: function(event) {
    this.setState( { highlighted: false } )
    this.props.mouse_handler( null );
  },
  render_tooltip: function() {
    if (!this.state.highlighted) return null;

    return <text className="tooltip" textAnchor="start" 
      transform={ 'translate(' + (this.props.x + 5) + ',' + this.props.y + ')' }>
      { this.props.name }
      </text>
  },
  is_tumor: function() {
    return this.props.name.match(/\.T[0-9]$/)
  },
  render: function() {
    var classes = classNames({
      dot: true,
      tumor: this.is_tumor(),
      normal: !this.is_tumor(),
      highlighted: this.props.name == this.props.highlighted_dot_name
    });


    return <a xlinkHref={ Routes.browse_model_path('sample', this.props.name) }>
        <circle className={classes}
          onMouseOver={ this.onMouseOver }
          onMouseOut={ this.onMouseOut }
          r="2.5"
          cx={ this.props.x }
          cy={ this.props.y }
          />
        {
          this.render_tooltip()
        }
      </a>;
  }
});

BarPlot = React.createClass({
  getInitialState: function() {
    return { }
  },
  render: function() {
    var self = this;
    var plot = this.props.plot;
    var margin = plot.margin,
        width = plot.width - margin.left - margin.right,
        height = plot.height - margin.top - margin.bottom;

    var yScale = d3.scale.linear()
      .domain( [ this.props.ymin, this.props.ymax ] )
      .range([ height, 0 ]);

    return <svg 
      id={ this.props.plot.name }
      className="bar_plot" 
      width={ this.props.plot.width }
      height={ this.props.plot.height }>
      <YAxis />
      <XAxis />
      <Legend />
      {
        this.props.data.map(function(datum,i) {
          return <Bar series={ datum.series }
                  color={ datum.color }
                  height={ datum.height }
                  max_height={ self.props.ymax }
                  width={ 20 }
                  yScale={ yScale }
                  x={ 10 + i * 30 }
                  mouse_handler={ self.highlight_dot_mouseover }
                  highlighted_dot_name={ self.state.highlighted_dot_name }
                  dots={ datum.dots } />
        })
      }
    </svg>
  },
  highlight_dot_mouseover: function(dot_name) {
    // do stuff
    console.log( 'this is a mouseover' );
    console.log(dot_name)
    this.setState( { highlighted_dot_name: dot_name } );
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
        y={ self.props.yScale(dot.height) }
        highlighted_dot_name={ self.props.highlighted_dot_name }
       />
    });
  },
  render: function() {
    return <g className="bar">
      <rect
        x={ this.props.x }
        y={ this.props.yScale( this.props.height ) - this.props.yScale(this.props.max_height) }
        width={ this.props.width }
        style={ { stroke: (this.props.color || "white") } }
        height={ this.props.yScale(0) - this.props.yScale( this.props.height ) }/>
      {
        this.render_dots()
      }
    </g>
  }
});

YAxis = React.createClass({
  render: function() {
    return <div></div>;
  }
});


XAxis = React.createClass({
  render: function() {
    return <div></div>;
  }
});


Legend = React.createClass({
  render: function() {
    return <div></div>;
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
  render_tooltip: function() {
    if (!this.state.highlighted) return null;

    console.log("State is highlighted.");

    // otherwise tooltip
    return <text className="tooltip" text-anchor="start" 
      transform={ 'translate(' + (this.props.x + 5) + ',' + this.props.y + ')' }>
      { this.props.name }
      </text>
  },
  render: function() {
    var classes = 'dot ' + (this.props.name == this.props.highlighted_dot_name ? 'highlighted' : '');


    return <a xlinkHref={ Routes.browse_model_path('sample', this.props.name) }>
        <circle className={classes}
          onMouseOver={ this.onMouseOver }
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

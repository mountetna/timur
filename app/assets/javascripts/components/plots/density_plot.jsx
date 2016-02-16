DensityPlot = React.createClass({
  render: function() {
    var self = this;

    if (!this.props.data || !this.props.data.length) return <div></div>;

    var plot = this.props.plot;
    var margin = plot.margin,
        canvas_width = plot.width - margin.left - margin.right,
        canvas_height = plot.height - margin.top - margin.bottom;

    var all_series = this.props.data;
    
    var x_label = all_series[0].row_names[0];
    var y_label = 'Density';

    var xmin = d3.min(all_series, function(series) { return d3.min(series.rows[0].x_values); });
    var xmax = d3.max(all_series, function(series) { return d3.max(series.rows[0].x_values); });
    var ymin = d3.min(all_series, function(series) { return d3.min(series.rows[0].density); });
    var ymax = d3.max(all_series, function(series) { return d3.max(series.rows[0].density); });

    var xScale = d3.scale.linear().domain([ xmin, xmax ]).range([0,canvas_width]);
    var yScale = d3.scale.linear().domain([ ymin, ymax ]).range([canvas_height,0]);

    return <svg 
        className="density_plot" 
        width={ plot.width }
        height={ plot.height } >
        <PlotCanvas
          x={ margin.left } y={ margin.top }
          width={ canvas_width }
          height={ canvas_height }>
        <YAxis x={ 0 }
          scale={ yScale }
          label={ y_label }
          ymin={ ymin }
          ymax={ ymax }
          num_ticks={5}
          tick_width={ 5 }/>
        <XAxis
          label={ x_label }
          y={ canvas_height }
          scale={ xScale }
          xmin={ xmin }
          xmax={ xmax }
          num_ticks={ 5 }
          tick_width={ 5 } />
        {
          all_series.map(function(series,i) {
            return <g key={self.props.data_key + series.name}>
            {
              series.rows[0].x_values.map(function(xval,j) {
                var lastx;
                var lasty;
                if (j > 0){
                  lastx = xScale(series.rows[0].x_values[j-1])
                  lasty = yScale(series.rows[0].density[j-1])
                }
                else{
                  lastx = xScale(xval)
                  lasty = yScale(series.rows[0].density[j])
                }
                return <path d={" M " + lastx + " " + lasty + " L " + xScale(xval) + " " + yScale(series.rows[0].density[j])}
                      stroke="blue"
                      stroke-width="5"
                      fill="none"
                      />;
              })
            }
            </g>;
          })
        }
        </PlotCanvas>
      </svg>;
  }
});

module.exports = DensityPlot;


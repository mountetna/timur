ScatterCurve = React.createClass({
  render: function() {
    var self = this;
    var series = this.props.series;
    var ymin = d3.min(series.matrix.row(0));
    var ymax = d3.max(series.matrix.row(0));
    var margin = {
      left: 50,
      right: 0,
      top: 0,
      bottom: 0
    }
    var canvas_width = this.props.width - margin.left - margin.right;
    var canvas_height = this.props.height - margin.top - margin.bottom;

    var y_label = series.matrix.row_name(0);

    var points = series.matrix.map_col(function(column,j,name) {
      return {
       value: column[0],
       name: name
      };
    });

    console.log(this.props.x);

    points.sort(function(point1,point2) { return point1.value - point2.value } );
    
    var yScale = d3.scale.linear()
      .domain([ ymin, ymax ])
      .range([canvas_height + margin.top, margin.top]);

    return <g className="scatter_curve">
        <PlotCanvas
          x={ this.props.x + margin.left } y={ margin.top }
          width={ canvas_width }
          height={ canvas_height }>
          <YAxis x={ 0 }
            scale={ yScale }
            ymin={ ymin }
            ymax={ ymax }
            num_ticks={5}
            tick_width={ 5 }/>
            {
              points.map(function(point,j) {
                var x = 10 + j * (canvas_width - 20) / (points.length-1 || 1);
                return <a key={j} xlinkHref={ Routes.browse_model_path('sample', name) }>
                    <circle className="dot"
                      r="2.5"
                      style={ {
                        fill: series.color
                      } }
                      cx={ x }
                      cy={ yScale(point.value) }
                      />
                  </a>;
              })
            }
          <text textAnchor="middle" transform={ 'translate(' 
                                      + (canvas_width / 2)
                                      + ','
                                      + (canvas_height + 20) 
                                      + ')' }>
            { series.name }
          </text>
        </PlotCanvas>
      </g>;
  }
});

OneDScatterPlot = React.createClass({
  render: function() {
    var self = this;

    if (!this.props.data || !this.props.data.length) return <div></div>;

    var plot = this.props.plot;
    var all_series = this.props.data;
    var margin = plot.margin,
        canvas_width = plot.width - margin.left - margin.right,
        canvas_height = plot.height - margin.top - margin.bottom,
        curve_width = canvas_width / all_series.length;

    var y_label = all_series[0].matrix.row_name(0);
    
    return <svg className="scatter_plot" width={ plot.width } height={ plot.height } >
      <text textAnchor="middle" transform={ 'translate(' 
                                  + (margin.left - 5)
                                  + ',' 
                                  + (canvas_height / 2) 
                                  + ') rotate(-90)' }>
        { y_label }
      </text>
        {
          all_series.map(function(series,i) {
            return <ScatterCurve key={self.props.data_key + series.name}
              x={ margin.left + i * curve_width }
              width={ curve_width }
              height={ canvas_height }
              series={ series }
              />
          })
        }
      </svg>;
  }
});

module.exports = OneDScatterPlot;

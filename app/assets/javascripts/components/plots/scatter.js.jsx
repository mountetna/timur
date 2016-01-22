ScatterPlotContainer = React.createClass({
  getInitialState: function() {
    return {
      mode: 'plot', 
      series: [],
      data: []
   }
  },
  render_edit: function() {
    var self = this;
    if (this.state.mode == 'plot') return null;
    return <div className="configure">
        Series: 
        {
          this.state.series.map(function(series_name) {
            return <div key={ series_name }>{ self.props.saves.series[series_name].name }</div>;
          })
        }
        <Selector showNone="disabled" name="series" values={ $.map(this.props.saves.series,this.mapping_map) }/>
        <input type="button" value="Add Series" onClick={ this.add_series }/>
        <div>
        x: <Selector showNone="disabled" name="x" onChange={ this.set_mapping } values={ $.map(this.props.saves.mappings,this.mapping_map) }/>
        y: <Selector showNone="disabled" name="y" onChange={ this.set_mapping } values={ $.map(this.props.saves.mappings,this.mapping_map) }/>
        </div>
      </div>
  },
  add_series: function() {
    var series = this.state.series;
    var select = $(React.findDOMNode(this)).find('select[name="series"]');
    series.push(select.val())
    console.log(series);
    this.setState({ series: series });
  },
  set_mapping: function(e) {
    var update = {}
    update[e.target.name] = e.target.value;
    this.setState(update);
  },
  render_temp: function() {
    return <div className="scatter plot">
      <Header mode={ this.state.mode } handler={ this.header_handler } can_edit={ true } can_close={ true }>
        { this.props.plot.name }
      </Header>
        {
          this.render_edit()
        }
      <svg className="scatter_plot" width={ 900 } height= { 300 }></svg>
      </div>
  },
  render: function() {
    var self = this;
    var all_series = this.state.data.map(function(series) {
      // TODO: need to add row names
      var matrix = new Matrix( series.values, null, series.samples );
      return matrix.col_filter(function(col) {
        return col.every(function(v) { return v != undefined });
      });
    });
    console.log(all_series);

    return <div className="scatter plot">
      <Header mode={ this.state.mode } handler={ this.header_handler } can_edit={ true } can_close={ true }>
        { this.props.plot.name }
      </Header>
        {
          this.render_edit()
        }
      <ScatterPlot data={ all_series } plot={{
          width: 900,
          height: 300,
          margin: {
            left: 30,
              top: 30,
              bottom: 30,
              right: 30
          }
        }}/>
    </div>;
  },
  mapping_map: function(mapping) {
    return {
      key: mapping.key,
      value: mapping.key,
      text: mapping.name
    }
  },
  header_handler: function(action) {
    if (action == 'cancel') this.setState({mode: 'plot'});
    else if (action == 'approve') {
      this.request_plot_data()
      this.setState({mode: 'submit'});
    }
    else if (action == 'edit') this.setState({mode: 'edit'});
    else if (action == 'close') this.props.handler('close', this.props.plot);
  },
  d3_render: function() {
    var data = this.state.data;
    var self = this;

    var margin = data.plot.margin,
        width = data.plot.width - margin.left - margin.right,
        height = data.plot.height - margin.top - margin.bottom;

    var xmin = d3.min(data.series, function(s) { return d3.min(s.values, function(v) { return v.x; }); }),
        xmax = d3.max(data.series, function(s) { return d3.max(s.values, function(v) { return v.x; }); });
    var ymin = d3.min(data.series, function(s) { return d3.min(s.values, function(v) { return v.y; }); }),
        ymax = d3.max(data.series, function(s) { return d3.max(s.values, function(v) { return v.y; }); });

    console.log(xmin);
    console.log(xmax);

    var chart = d3.scatter()
        .width(width)
        .height(height)
        .xlabel(data.xlabel)
        .ylabel(data.ylabel)
        .xdomain([xmin,xmax])
        .ydomain([ymin,ymax])
        .series(data.series.map( function(s) {
          var save = self.props.saves.series[s.key];
          s.name = save.name;
          s.color = save.color;
          return s;
        }));

    console.log("Drawing chart");
    var base = d3.select(React.findDOMNode(this));
    var vis = base.select("svg.scatter_plot");
    vis.selectAll("g.plot").remove()
    vis.selectAll("g.plot")
        .data([data])
        .enter()
        .append("g")
        .attr("class", "plot")
        .attr("transform", function(d,i) {
          return "translate(" + margin.left + "," + margin.top + ")"
        })
        .call(chart);
  },
  update_query: function(name, value) {
    query = this.state.query;
    query[ name ] = value;
    this.setState({ query: query });
  },
  request_plot_data: function() {
    var self = this;
    var request = {
        series: this.state.series,
        mappings: [ this.state.x, this.state.y ]
      };
    console.log(request);
    $.ajax({
      url: Routes.plot_json_path(), 
      type: 'POST',
      data: JSON.stringify(request), 
      dataType: 'json',
      contentType: 'application/json',
      success: function(result) {
        self.setState({ data: result.data, series: result.series, mappings: result.mappings, mode: 'plot' });
      }
    });
  }
});

ScatterPlot = React.createClass({
  render: function() {
    var self = this;

    if (!this.props.data || !this.props.data.length) return <div></div>;

    var plot = this.props.plot;
    var margin = plot.margin,
        width = plot.width - margin.left - margin.right,
        height = plot.height - margin.top - margin.bottom;

    var all_series = this.props.data;

    var xmin = d3.min(all_series, function(series) { return d3.min(series.row(0)); });
    var xmax = d3.max(all_series, function(series) { return d3.max(series.row(0)); });
    var ymin = d3.min(all_series, function(series) { return d3.min(series.row(1)); });
    var ymax = d3.max(all_series, function(series) { return d3.max(series.row(1)); });

    var xScale = d3.scale.linear().domain([ xmin, xmax ]).range([0,width]);
    var yScale = d3.scale.linear().domain([ ymin, ymax ]).range([height,0]);

    return <svg 
        className="scatter_plot" 
        width={ 900 }
        height={ 300 } >
        <PlotCanvas
          x={ 10 } y={ 10 }
          width={ width }
          height={ height }>
        <YAxis x={ -3 }
          scale={ yScale }
          ymin={ ymin }
          ymax={ ymax }
          num_ticks={5}
          tick_width={ 5 }/>
        <XAxis />
        <Legend x={ width - 30 } y="0" series={ [
          { name: 'a', color: 'red' },
          { name: 'b', color: 'blue' },
        ]}/>
        {
          all_series.map(function(matrix,i) {
            return matrix.map_col(function(point,j,name) {
              return <a xlinkHref={ Routes.browse_model_path('sample', name) }>
                  <circle className="dot"
                    r="2.5"
                    cx={ xScale(point[0]) }
                    cy={ yScale(point[1]) }
                    />
                </a>;
            });
          })
        }
        </PlotCanvas>
      </svg>;
  }
});

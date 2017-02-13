var HeatmapPlot = React.createClass({
  getInitialState: function() {
    return { highlight_cell: null }
  },
  chroma_scale: chroma.scale(['red','black','green']).domain([-1.0, 1.0]),
  compute_color: function(cell) {
    if (cell == undefined) return "white";

    return this.chroma_scale(cell);
  },
  render: function() {
    var self = this;

    if (!this.props.data || !this.props.data.length) return <div></div>;

    var plot = this.props.plot;
    var margin = plot.margin,
        canvas_width = plot.width - margin.left - margin.right,
        canvas_height = plot.height - margin.top - margin.bottom;

    var series = this.props.data[0];
    var cell_height = canvas_height / series.matrix.num_rows;
    var cell_width = canvas_width / series.matrix.num_cols;

    var row_labels_or_dendrogram
    var col_labels_or_dendrogram

    if (this.props.col_dendrogram) {
      // draw a col_dendrogram
      col_labels_or_dendrogram=<g transform={
          'translate(0,-'+margin.top+')'
          }>
          <Dendrogram tree={ this.props.col_dendrogram } 
          height={margin.top-100}
          width={canvas_width}/>
        </g>
    }
    else {
      col_labels_or_dendrogram = <g className="col_labels">
        {
          series.matrix.map_col(function(col,j,name) {
            return <text key={ j } textAnchor="start" transform={ 'translate('
                        + (j * cell_width + 10)
                        + ','
                        + (-5)
                        + ') rotate(-90)' }>
              { name }
              </text>
          })
        }
      </g>
    }
    if (this.props.row_dendrogram) {
      // draw a row_dendrogram
      row_labels_or_dendrogram=<g transform={
          'translate(-'+margin.left+','+canvas_height+') rotate(-90)'
        }>
          <Dendrogram tree={ this.props.row_dendrogram } 
          height={margin.left-200} 
          width={canvas_height}/>
        </g>
    }
    else {
      row_labels_or_dendrogram = series.matrix.map_row(function(row,i,name) {
         return <text key={ i } textAnchor="end" transform={ 'translate('
                     + (-5)
                     + ','
                     + (i * cell_height + 12)
                     + ')' }>
           { name }
           </text>
      })
    }
    var tooltip;

    if (!this.state.highlight_cell) tooltip = null;
    else {
      var cell = this.state.highlight_cell;
      var contents = cell.contents;

      tooltip = <Tooltip x={
          cell.col * cell_width
        } y={
          cell.row * cell_height
        } display={
        {
          "Row name": series.matrix.row_name(cell.row),
          "Col name": series.matrix.col_name(cell.col),
          "Value": contents == undefined ? "none" : contents
        }
      } />;
    }

    return <svg 
        className="heatmap_plot" 
        width={ plot.width }
        height={ plot.height } >
        <PlotCanvas
          x={ margin.left } y={ margin.top }
          width={ canvas_width }
          height={ canvas_height }>
        {
          row_labels_or_dendrogram
        }
        {
          col_labels_or_dendrogram
        }
        
        {
          series.matrix.map_row(function(row,i,name) {
            return <g key={ self.props.data_key + name }>
              {
                row.map(function(cell,j) {
                  var color = self.compute_color(cell);

                  return <rect className="cell"
                    key={ i + 'x' + j }
                    x={ j*cell_width }
                    y={ i*cell_height}
                    width={ cell_width - 1 }
                    height={ cell_height - 1 }
                    style={ {
                      fill: color
                    } }
                    onMouseOver={
                      function(evt) {
                        self.setState( {
                          highlight_cell: {
                            contents: cell,
                            row: i,
                            col: j
                          }
                        });
                      }
                    }
                    onMouseOut={
                      function(evt) {
                        self.setState( { highlight_cell: null });
                      }
                    }
                    />;
                })
              }
              </g>;
          })
        }
        {
          tooltip
        }
        </PlotCanvas>
      </svg>;
  },
})

module.exports = HeatmapPlot

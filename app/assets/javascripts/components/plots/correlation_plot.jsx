import Tooltip from '../tooltip';
import React, { Component } from 'react';

var CorrelationPlot = React.createClass({
  getInitialState: function() {
    return { highlight_cell: null }
  },
  chroma_scale: chroma.scale(['red','black','green']).domain([-1.0, 1.0]),
  compute_color: function(cell) {
    if (cell.count == undefined || cell.count < 2) return "white";

    return this.chroma_scale(cell.pearson_r);
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
          "Pearson R": (contents.pearson_r == undefined ? "null" : contents.pearson_r.toFixed(3)),
          "P-value": (contents.p_value == undefined ? "null" : contents.p_value.toFixed(3)),
          "Count": (contents.count == undefined ? "null" : contents.count),
        }
      } />;
    }

    return <svg 
        className="correlation_plot" 
        width={ plot.width }
        height={ plot.height } >
        <PlotCanvas
          x={ margin.left } y={ margin.top }
          width={ canvas_width }
          height={ canvas_height }>
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
        {
          series.matrix.map_row(function(row,i,name) {
            return <g key={ self.props.data_key + name }>
              <text textAnchor="end" transform={ 'translate('
                        + (-5)
                        + ','
                        + (i * cell_height + 12)
                        + ')' }>
              { name }
              </text>
              {
                row.map(function(cell,j) {
                  var color = self.compute_color(cell);

                  return <rect className="cell"
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

module.exports = CorrelationPlot

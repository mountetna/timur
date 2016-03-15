DendrogramPlot = React.createClass({
  chroma_scale: chroma.scale(['red','black','green']).domain([-1.0, 1.0]),
  compute_color: function(cell) {
    if (cell.count == undefined || cell.count < 2) return "white";

    return this.chroma_scale(cell.pearson_r);
  },
  render: function() {
    var self = this
    var tree = this.props.data ? new Tree(this.props.data) : null
    var plot = this.props.plot
    var margin = plot.margin,
        canvas_width = plot.width - margin.left - margin.right,
        canvas_height = plot.height - margin.top - margin.bottom;

    if (!tree) return <div></div>

    var max_depth = d3.max( tree.leaves(), function(leaf) { return leaf.depth })
    var leaf_width = canvas_width / tree.leaves().length 
    return <svg 
        className="dendrogram_plot" 
        width={ plot.width }
        height={ plot.height } >
        <PlotCanvas
          x={ margin.left } 
          y={ margin.top }
          width={ canvas_width }
          height={ canvas_height }>
        {
          tree.leaves().map(function(leaf,i) {
           return <line key={ i } 
                      style={ { stroke: "blue" } }
                      x1={ leaf.position * leaf_width + leaf_width / 2 } 
                      x2={ leaf.position * leaf_width + leaf_width / 2 } 
                      y1={ leaf.depth / max_depth * canvas_height }
                      y2={ canvas_height } r="2"/>
          })
        }
        {
          tree.internal().map(function(internal,i) {
           return <g key={i}>
                    <line style={ { stroke:  "red" } }
                      x1={ internal.left * leaf_width + leaf_width / 2 }
                      x2={ internal.right * leaf_width + leaf_width / 2 }
                      y1={ internal.depth / max_depth * canvas_height }
                      y2={ internal.depth / max_depth * canvas_height }
                      r="2"/>

                    <line style={ { stroke:  "red" } }
                      x1={ (internal.left+internal.right) / 2 * leaf_width + leaf_width / 2 }
                      x2={ (internal.left+internal.right) / 2 * leaf_width + leaf_width / 2 }
                      y1={ internal.depth / max_depth * canvas_height }
                      y2={ (internal.depth - internal.branch_height) / max_depth * canvas_height }
                      r="2"/>

                  </g>
          })
        }
        {
          tree.leaves().map(function(leaf,i) {
            return <text 
              transform={ "translate(" + (leaf.position * leaf_width + leaf_width / 2) + "," + canvas_height+") rotate(-90)" }
              textAnchor="end" >
              { leaf.name }
              </text>
          })
        }
        </PlotCanvas>
      </svg>;
  },
})

module.exports = DendrogramPlot

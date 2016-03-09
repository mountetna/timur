DendrogramPlot = React.createClass({
  chroma_scale: chroma.scale(['red','black','green']).domain([-1.0, 1.0]),
  compute_color: function(cell) {
    if (cell.count == undefined || cell.count < 2) return "white";

    return this.chroma_scale(cell.pearson_r);
  },
  draw_branches_for: function(node,depth) {
    var this_node_drawing = <line y2={ depth * 3 } y1={ depth * 3 } x1="250" x2="240"/>
    var self = this

    return <g>
      { this_node_drawing }
      {
        node.children.map(function(child_node, i) {
          return <g key={ i }>
            {
              self.draw_branches_for(child_node,depth+1)
            }
            </g>
        })
      }
    </g>
  },
  render: function() {
    var self = this
    var tree = this.props.data
    var plot = this.props.plot
    var margin = plot.margin,
        canvas_width = plot.width - margin.left - margin.right,
        canvas_height = plot.height - margin.top - margin.bottom;

    if (!tree) return <div></div>

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
           this.draw_branches_for(tree,0)
        }
        </PlotCanvas>
      </svg>;
  },
})

module.exports = DendrogramPlot

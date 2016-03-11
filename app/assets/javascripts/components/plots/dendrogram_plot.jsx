DendrogramPlot = React.createClass({
  chroma_scale: chroma.scale(['red','black','green']).domain([-1.0, 1.0]),
  compute_color: function(cell) {
    if (cell.count == undefined || cell.count < 2) return "white";

    return this.chroma_scale(cell.pearson_r);
  },
  draw_branches_for: function(node,depth,leaf_counter) {
    var self = this

    if (node.children.length == 0) {
      return {
        leaves: [
          {
            position: leaf_counter,
            depth: depth,
            name: node.name
          }
        ],
        internal: [],
        my_position: leaf_counter
      }
    }

    var points = {
      leaves: [],
      internal: []
    }
    var min_position = 1e9, max_position = -1
    node.children.forEach(function(child_node, i) {
      var child_points = self.draw_branches_for(child_node, depth + node.branch_length, leaf_counter + points.leaves.length)
      points.leaves = points.leaves.concat(child_points.leaves)
      points.internal = points.internal.concat(child_points.internal)
      if (child_points.my_position > max_position) max_position = child_points.my_position
      if (child_points.my_position < min_position) min_position = child_points.my_position
    })

    points.internal = points.internal.concat({
      left: min_position,
      right: max_position,
      depth: depth + node.branch_length,
      branch_height: node.branch_length
    })
    points.my_position = (min_position + max_position) / 2
    return points
  },
  render: function() {
    var self = this
    var tree = this.props.data
    var plot = this.props.plot
    var margin = plot.margin,
        canvas_width = plot.width - margin.left - margin.right,
        canvas_height = plot.height - margin.top - margin.bottom;

    if (!tree) return <div></div>

    var points = this.draw_branches_for(tree,0,0)
    var max_depth = d3.max( points.leaves, function(leaf) { return leaf.depth })
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
          points.leaves.map(function(leaf,i) {
           return <line key={ i } 
                      style={ { stroke: "blue" } }
                      x1={ leaf.position / points.leaves.length * canvas_width } 
                      x2={ leaf.position / points.leaves.length * canvas_width } 
                      y1={ leaf.depth / max_depth * canvas_height }
                      y2={ canvas_height } r="2"/>
          })
        }
        {
          points.internal.map(function(internal,i) {
           return <g key={i}>
                    <line style={ { stroke:  "red" } }
                      x1={ internal.left / points.leaves.length * canvas_width } 
                      x2={ internal.right / points.leaves.length * canvas_width } 
                      y1={ internal.depth / max_depth * canvas_height }
                      y2={ internal.depth / max_depth * canvas_height }
                      r="2"/>

                    <line style={ { stroke:  "red" } }
                      x1={ (internal.left+internal.right) / 2 / points.leaves.length * canvas_width } 
                      x2={ (internal.left+internal.right) / 2 / points.leaves.length * canvas_width } 
                      y1={ internal.depth / max_depth * canvas_height }
                      y2={ (internal.depth - internal.branch_height) / max_depth * canvas_height }
                      r="2"/>

                  </g>
          })
        }
        {
          points.leaves.map(function(leaf,i) {
            return <text 
              transform={ "translate(" + (leaf.position / points.leaves.length * canvas_width) + "," + canvas_height+") rotate(-90)" }
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

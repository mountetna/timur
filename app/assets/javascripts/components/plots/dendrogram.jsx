import * as d3 from "d3"

var Dendrogram = React.createClass({
  render: function() {
    var tree = this.props.tree
    var canvas_height = this.props.height,
        canvas_width = this.props.width
    var max_depth = d3.max( tree.leaves(), function(leaf) { return leaf.depth })
    var leaf_width = canvas_width / tree.leaves().length 

    return <g className="dendrogram">
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
              transform={ "translate(" + (leaf.position * leaf_width + leaf_width / 2) + "," + canvas_height+") rotate(90)" }
              textAnchor="start" >
              { leaf.name }
              </text>
          })
        }
      </g>
  }
})

module.exports = Dendrogram

window.Tree = function(root) {
  var self = this
  var draw_branches_for = function(node,depth,leaf_counter) {
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
      var child_points = draw_branches_for(child_node, depth + node.branch_length, leaf_counter + points.leaves.length)
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
  }

  var node_info

  this.leaves = function() {
    if (!node_info) node_info = draw_branches_for(root,0,0)
    return node_info.leaves
  }
  this.internal = function() {
    if (!node_info) node_info = draw_branches_for(root,0,0)
    return node_info.internal
  }
}

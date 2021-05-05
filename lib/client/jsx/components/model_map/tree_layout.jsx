class LayoutNode {
  constructor(model, layout) {
    this.model_name = model.name;
    this.model = model;
    this.layout = layout;
  }

  createLinks() {
    let model = this.model;

    this.links = Object.keys(model.attributes).map((att_name) => {
      let { link_model_name } = model.attributes[att_name];

      if (!link_model_name) return null;

      let other = this.layout.nodes[ link_model_name ];

      if (!other) return null;

      if (other.model.parent == model.name) return other;
    }).filter(_=>_)
  }

  unplacedLinks() {
    // there should only be a single placed link. Return
    // links in circular order after that
    let index = this.links.findIndex(link => link.other.model_name == this.tree_parent)
    return Array(this.links.length-(index >= 0 ? 1 : 0)).fill().map((_,i) => this.links[(index + i + 1)%this.links.length])
  }

  setDepth(depth, grid) {
    this.depth = depth;

    if (!grid[depth]) grid[depth] = []

    grid[depth].push(this);

    this.pos = grid[depth].length;

    // now we sort our links by weight
    let sorted = this.links.sort( (node1,node2) => node2.weight-node1.weight );
    let midsort = []
    sorted.forEach( (node, i) => i%2 ? midsort.push(node) : midsort.unshift(node) )

    midsort.forEach( node => node.setDepth(depth+1,grid) )
  }

  setWeight() {
    this.weight = 1 + this.links.reduce((s,l) => s += l.setWeight(), 0)

    return this.weight;
  }

  place(grid) {
    if (!this.depth) return;

    let maxpos = grid[this.depth].length;
    let maxdepth = grid.length;
    this.center = {
      x: (this.pos) / (maxpos+1) * this.layout.width,
      y: this.depth / (maxdepth) * this.layout.height
    };
    this.size = 40;
  }
}

class TreeLayout {
  constructor(models, width, height) {
    this.nodes = models.reduce((nodes, model) => {
      nodes[model.name] = new LayoutNode(model,this)
      return nodes
    }, {})
    this.width = width
    this.height = height

    for (var model_name in this.nodes) {
      this.nodes[model_name].createLinks()
    }

    let grid = [];

    let { project } = this.nodes;

    if (project) {
      project.setWeight();
      project.setDepth(1, grid);


      Object.values(this.nodes).forEach( node => node.place(grid) );
    }

  }
}

export default TreeLayout;

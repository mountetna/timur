class LayoutNode {
  constructor(template, layout) {
    this.model_name = template.name
    this.template = template
    this.layout = layout
  }

  createLinks() {
    let template = this.template
    this.links = Object.keys(template.attributes).map((att_name) => {
      let attribute = template.attributes[att_name]
      if (!attribute.link_model_name) return null
      let other = this.layout.nodes[ attribute.link_model_name ]
      if (!other) return null

      // the link exists if - you are the other model's parents
      if (!(template.parent == attribute.link_model_name
        || other.template.parent == this.model_name 
        || (!template.parent && other.template.parent)
        || (!other.template.parent && template.parent))) return null
      return { other }
    }).filter(_=>_)
  }

  unplacedLinks() {
    // there should only be a single placed link. Return
    // links in circular order after that
    let index = this.links.findIndex(link => link.other.model_name == this.wheel_parent)
    return Array(this.links.length-(index >= 0 ? 1 : 0)).fill().map((_,i) => this.links[(index + i + 1)%this.links.length])
  }

  subtend(i, num_links) {
    let gap_size = (this.arc[1] - this.arc[0]) / Math.max(1.5,num_links)
    // if num_links is 1 we will be skewed because of the low gap_size
    return [
      this.arc[0]/2 + this.arc[1]/2 + gap_size * (i - num_links/2),
      this.arc[0]/2 + this.arc[1]/2 + gap_size * (i + 1 - num_links/2)
    ]
  }
  place(wheel_parent, depth, arc) {
    this.depth = depth
    this.arc = arc
    this.size = 40 / depth
    this.wheel_parent = wheel_parent

    if (depth == 1)
      this.center = {
        x: this.layout.width/2,
        y: this.layout.height/2
      };
    else {
      let th = (arc[1] + arc[0])/2

      // the first point has a radius of r - r / 2, the next of r - r / 4, the
      // next of r - r / 8
      let r = this.layout.width * 3 * (1 - Math.pow(1 / depth, 0.1))
      this.center = {
        x: this.layout.width / 2 + r * Math.cos(Math.PI * th / 180),
        y: this.layout.height / 2 + r * Math.sin(Math.PI * th / 180)
      }
    }

    let unplaced = this.unplacedLinks()

    for (var [ i, link ] of unplaced.entries()) {
      link.other.place(this.model_name, depth + 1, this.subtend(i,unplaced.length))
    }
  }
}

class WheelLayout {
  constructor(selected_model, templates, width, height) {
    this.nodes = templates.reduce((nodes, template) => {
      nodes[template.name] = new LayoutNode(template,this);
      return nodes;
    }, {});
    this.width = width;
    this.height = height;

    for (var model_name in this.nodes) {
      this.nodes[model_name].createLinks();
    }

    if (this.nodes[selected_model]) this.nodes[selected_model].place(null, 1, [0,360]);
  }
}

export default WheelLayout;

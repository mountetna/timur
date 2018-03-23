import { connect } from 'react-redux';

import { easeQuadIn } from 'd3-ease';
import React, { Component } from 'react'
import { requestModels } from '../actions/magma_actions'
import Magma from '../magma'
import { Animate } from 'react-move'

class ModelLink extends Component {
  render() {
    let { center, parent, size } = this.props
    if (!parent || !center) return null
    return <g className="model_link">
      <line x1={center[0]} y1={center[1]} x2={parent[0]} y2={parent[1]}/>
    </g>
  }
}

class ModelNode extends Component {
  render() {
    let { model_name, center, size } = this.props
    if (!center) return null
    let [ x, y ] = center
    return <g className="model_node">
        <g transform={ `translate(${x},${y})` } onClick={ () => this.props.handler(this.props.model_name) }>
        <circle 
          r={ size }
          cx={0}
          cy={0}/>
        <text style={{fontSize: 16 / Math.pow(40/size, 0.3333) }} dy="0.4em" textAnchor="middle">
          { model_name }
        </text>
      </g>
    </g>
  }
}


class ModelAttribute extends Component {
  type() {
    let attribute = this.props.template.attributes[this.props.att_name]

    if (attribute.type) return attribute.type

    return attribute.attribute_class.replace(/Magma::/,'').replace('Attribute','')
  }
  render() {
    let { att_name, template } = this.props
    let attribute = template.attributes[att_name]
    return <div className="attribute" key={ att_name }>
      <span>{att_name}</span>
      <span className="type">({this.type()})</span>
      { attribute.desc ?
      <span className="description">{ attribute.desc }</span>
          : null
      }
    </div>
  }
}

class ModelReport extends Component {
  render() {
    let { model_name, template } = this.props
    if (!template) return <div/>
    return <div className="report">
      <span className="title">{model_name}</span>
      <span className="description">{template.description}</span>
      {
        Object.keys(template.attributes).map((att_name,i) =>
          template.attributes[att_name].shown ? 
          <ModelAttribute key={i} att_name={att_name} template={template}/>
          : null
        )
      }
    </div>
  }
}

ModelReport = connect(
  (state,props) => {
    let magma = new Magma(state)
    return {
      template: magma.template(props.model_name)
    }
  }
)(ModelReport)

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
      if (!attribute.model_name) return null
      let other = this.layout.nodes[ attribute.model_name ]
      if (!other) return null

      // the link exists if - you are the other model's parents
      if (!(template.parent == attribute.model_name
        || other.template.parent == this.model_name 
        || (!template.parent && other.template.parent)
        || (!other.template.parent && template.parent))) return null
      return { other }
    }).filter(_=>_)
  }

  unplacedLinks() {
    // there should only be a single placed link. Return
    // links in circular order after that
    let index = this.links.findIndex(link => link.other.model_name == this.parent_name)
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
  place(parent_name, depth, arc) {
    this.depth = depth
    this.arc = arc
    this.size = 40 / depth
    this.parent_name = parent_name

    if (depth == 1) 
      this.center = [ this.layout.width/2, this.layout.height/2 ]
    else {
      let th = (arc[1] + arc[0])/2

      // the first point has a radius of r - r / 2, the next of r - r / 4, the
      // next of r - r / 8
      let r = this.layout.width * 3 * (1 - Math.pow(1 / depth, 0.1))
      this.center = [
        this.layout.width / 2 + r * Math.cos(Math.PI * th / 180),
        this.layout.height / 2 + r * Math.sin(Math.PI * th / 180)
      ]
    }

    let unplaced = this.unplacedLinks()

    for (var [ i, link ] of unplaced.entries()) {
      link.other.place(this.model_name, depth + 1, this.subtend(i,unplaced.length))
    }
  }
}

class Layout {
  constructor(center_model, templates, width, height) {
    this.nodes = templates.reduce((nodes, template) => {
      nodes[template.name] = new LayoutNode(template,this)
      return nodes
    }, {})
    this.width = width
    this.height = height

    for (var model_name in this.nodes) {
      this.nodes[model_name].createLinks()
    }

    if (this.nodes[center_model]) this.nodes[center_model].place(null, 1, [0,360])
  }
}

class ModelAnimation extends Component {
  nodeCenter(node, parent_name, layout) {
    return {
      size: node.size,
      center_x: node.center && node.center[0],
      center_y: node.center && node.center[1],
      parent_x: parent_name ? layout.nodes[parent_name].center[0] : null,
      parent_y: parent_name ? layout.nodes[parent_name].center[1] : null
    };
  }
  render() {
    let { model_name, layout, layout2, onRest, handler, ModelElement } = this.props;

    let node = layout.nodes[model_name];
    let node2 = layout2.nodes[model_name];

    let center = this.nodeCenter(node,node2.parent_name,layout);
    let center2 = this.nodeCenter(node2,node2.parent_name,layout2);

    return <Animate
      start={ center }
      enter={
        {
          size: [ center2.size ],
          center_x: [ center2.center_x ],
          center_y: [ center2.center_y ],
          parent_x: [ center2.parent_x ],
          parent_y: [ center2.parent_y ],
          timing: { duration: 400, ease: easeQuadIn },
          events: onRest ? { end: onRest } : {}
        }
      }
      key={ model_name }>
      {
        data => {
          return <ModelElement
            handler={handler}
            key={model_name}
            size={ data.size }
            center={ data.center_x ? [ data.center_x, data.center_y ] : null }
            parent={ data.parent_x ? [ data.parent_x, data.parent_y ] : null }
            model_name={ model_name }/>
        }
      }
    </Animate>
  }
}

class ModelMap extends Component {
  constructor() {
    super()
    this.state = { current_model: "project" }
  }
  componentDidMount() {
    this.props.requestModels();
  }
  showModel(model_name) {
    this.setState( { new_model: model_name } )
  }
  renderLinks(model_names, layout, layout2) {
    return model_names.map(
      (model_name) => {
        let node = layout.nodes[model_name];
        if (layout2) {
          return <ModelAnimation
            key={model_name}
            model_name={ model_name }
            layout={layout}
            layout2={layout2}
            ModelElement={ModelLink}/>;
        } else
        return <ModelLink
          key={model_name}
          center={ node.center }
          parent={ node.parent_name ? layout.nodes[node.parent_name].center : null }
          size={ node.size }
        />
      }
    )
  }
  setNewModel(model_name) {
    let { new_model } = this.state;
    this.setState({
      new_model: null,
      current_model: new_model
    })
  }
  renderModels(new_model, model_names, layout, layout2) {
    return model_names.map(
      (model_name) => {
        let node = layout.nodes[model_name];

        if (layout2) {
          let node2 = layout2.nodes[model_name];
          return <ModelAnimation
            key={model_name}
            model_name={ model_name }
            layout={layout}
            layout2={layout2}
            ModelElement={ModelNode}
            onRest={ new_model == model_name ?  this.setNewModel.bind(this) : null }
            handler={ this.showModel.bind(this) }
          />;
        } else
        return <ModelNode
          key={model_name}
          center={ node.center }
          size={ node.size }
          handler={ this.showModel.bind(this) }
          model_name={ model_name }/>
      }
    )
  }
  render() {
    let [ width, height ] = [ 500, 500 ];
    let { templates, model_names } = this.props;
    let { new_model, current_model } = this.state;
    let layout = new Layout(current_model, templates, width, height);
    let layout2;

    if (new_model) layout2 = new Layout(new_model, templates, width, height);

    return <div id="map">
      <svg width={width} height={height}>
        {
          this.renderLinks(model_names, layout, layout2)
        }
        {
          this.renderModels(new_model, model_names, layout, layout2)
        }
      </svg>
      <ModelReport model_name={ current_model }/>
    </div>
  }
}

export default connect(
  (state) => {
    let magma = new Magma(state);
    let model_names = magma.modelNames();
    return {
      model_names,
      templates: model_names.map(model_name => magma.template(model_name))
    }
  },
  {
    requestModels
  }
)(ModelMap);

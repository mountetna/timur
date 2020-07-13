import {connect} from 'react-redux';

import React, {Component} from 'react';
import {requestModels} from '../actions/magma_actions';
import {selectModelNames, selectTemplate} from '../selectors/magma';
import ModelReport from './model_report';

class ModelLink extends Component {
  render() {
    let {center, parent, size} = this.props;
    if (!parent || !center) return null;
    return (
      <g className="model_link">
        <line x1={center[0]} y1={center[1]} x2={parent[0]} y2={parent[1]} />
      </g>
    );
  }
}

class ModelNode extends Component {
  render() {
    let {model_name, center, size, selected} = this.props;
    if (!center) return null;
    let [x, y] = center;
    const className = selected ? 'model_node selected' : 'model_node';
    return (
      <g className={className}>
        <g
          transform={`translate(${x},${y})`}
          onClick={() => this.props.handler(this.props.model_name)}
        >
          <circle r={size} cx={0} cy={0} />
          <text
            style={{fontSize: 16 / Math.pow(40 / size, 0.3333)}}
            dy="0.4em"
            textAnchor="middle"
          >
            {model_name}
          </text>
        </g>
      </g>
    );
  }
}

class LayoutNode {
  constructor(template, layout) {
    this.model_name = template.name;
    this.template = template;
    this.layout = layout;
  }

  createLinks() {
    let template = this.template;
    this.links = Object.keys(template.attributes)
      .map((att_name) => {
        let attribute = template.attributes[att_name];
        if (!attribute.link_model_name) return null;
        let other = this.layout.nodes[attribute.link_model_name];
        if (!other) return null;

        // the link exists if - you are the other model's parents
        if (
          !(
            template.parent == attribute.link_model_name ||
            other.template.parent == this.model_name ||
            (!template.parent && other.template.parent) ||
            (!other.template.parent && template.parent)
          )
        )
          return null;
        return {other};
      })
      .filter((_) => _);
  }

  unplacedLinks() {
    // there should only be a single placed link. Return
    // links in circular order after that
    let index = this.links.findIndex(
      (link) => link.other.model_name == this.parent_name
    );
    return Array(this.links.length - (index >= 0 ? 1 : 0))
      .fill()
      .map((_, i) => this.links[(index + i + 1) % this.links.length]);
  }

  subtend(i, num_links) {
    let gap_size = (this.arc[1] - this.arc[0]) / Math.max(1.5, num_links);
    // if num_links is 1 we will be skewed because of the low gap_size
    return [
      this.arc[0] / 2 + this.arc[1] / 2 + gap_size * (i - num_links / 2),
      this.arc[0] / 2 + this.arc[1] / 2 + gap_size * (i + 1 - num_links / 2)
    ];
  }
  place(parent_name, depth, arc) {
    this.depth = depth;
    this.arc = arc;
    this.size = 40 / depth;
    this.parent_name = parent_name;

    if (depth == 1) this.center = [this.layout.width / 2, this.size + 10];
    // this.center = [ this.layout.width/2, this.layout.height/2 ]
    else {
      let th = (arc[1] + arc[0]) / 2;

      // the first point has a radius of r - r / 2, the next of r - r / 4, the
      // next of r - r / 8
      let r = this.layout.width * 3 * (1 - Math.pow(1 / depth, 0.1));
      this.center = [
        this.layout.width / 2 + r * Math.cos((Math.PI * th) / 180),
        this.layout.height / 2 + r * Math.sin((Math.PI * th) / 180)
      ];
    }

    let unplaced = this.unplacedLinks();

    for (var [i, link] of unplaced.entries()) {
      link.other.place(
        this.model_name,
        depth + 1,
        this.subtend(i, unplaced.length)
      );
    }
  }
}

class Layout {
  constructor(center_model, templates, width, height) {
    this.nodes = templates.reduce((nodes, template) => {
      nodes[template.name] = new LayoutNode(template, this);
      return nodes;
    }, {});
    this.width = width;
    this.height = height;

    for (var model_name in this.nodes) {
      this.nodes[model_name].createLinks();
    }

    if (this.nodes[center_model])
      this.nodes[center_model].place(null, 1, [0, 360]);
  }
}

class ModelMap extends Component {
  constructor() {
    super();
    this.state = {current_model: 'project'};
  }
  componentDidMount() {
    this.props.requestModels();
  }
  showModel(model_name) {
    this.setState({new_model: model_name});
  }
  renderLinks(model_names, layout) {
    return model_names.map((model_name) => {
      let node = layout.nodes[model_name];
      return (
        <ModelLink
          key={model_name}
          center={node.center}
          parent={
            node.parent_name ? layout.nodes[node.parent_name].center : null
          }
          size={node.size}
        />
      );
    });
  }
  renderModels(new_model, model_names, layout) {
    return model_names.map((model_name) => {
      let node = layout.nodes[model_name];

      return (
        <ModelNode
          key={model_name}
          center={node.center}
          size={node.size}
          handler={this.showModel.bind(this)}
          model_name={model_name}
          selected={model_name === new_model}
        />
      );
    });
  }
  render() {
    let [width, height] = [500, 500];
    let {templates, model_names} = this.props;
    let {new_model, current_model} = this.state;
    let layout = new Layout(current_model, templates, width, height);

    const selected_model = new_model ? new_model : current_model;

    return (
      <div id="map">
        <svg width={width} height={height}>
          {this.renderLinks(model_names, layout)}
          {this.renderModels(selected_model, model_names, layout)}
        </svg>
        <ModelReport model_name={selected_model} />
      </div>
    );
  }
}

export default connect(
  (state) => {
    let model_names = selectModelNames(state);
    return {
      model_names,
      templates: model_names.map((model_name) =>
        selectTemplate(state, model_name)
      )
    };
  },
  {
    requestModels
  }
)(ModelMap);

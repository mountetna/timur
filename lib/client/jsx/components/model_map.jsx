import React from 'react';
import { connect } from 'react-redux';

import { requestModels } from '../actions/magma_actions';
import { selectModelNames, selectTemplate } from '../selectors/magma';

import ModelLink from './model_map/model_link';
import ModelNode from './model_map/model_node';
import ModelReport from './model_map/model_report';
import ModelAnimation from './model_map/model_animation';
import Layout from './model_map/tree_layout';


class ModelMap extends React.Component {
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
  setNewModel(model_name) {
    let { new_model } = this.state;
    this.setState({
      new_model: null,
      current_model: new_model
    })
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
          parent={ node.model.parent && layout.nodes[node.model.parent] ?
              layout.nodes[node.model.parent].center : null }
          size={ node.size }
        />
      }
    )
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
        <defs>
          <marker id="arrow"
            markerWidth="3"
            markerHeight="3"
            refX="0" refY="1"
            orient="auto"
            markerUnits="strokeWidth">
            <path d="M0,0 L0,2 L3,1 z"/>
          </marker>
        </defs>
        {
          this.renderLinks(model_names, layout, layout2)
        }
      </svg>
        {
          this.renderModels(new_model, model_names, layout, layout2)
        }
      <ModelReport model_name={ current_model }/>
    </div>
  }
}

export default connect(
  (state) => {
    let model_names = selectModelNames(state);
    return {
      model_names,
      templates: model_names.map(model_name => selectTemplate(state,model_name))
    }
  },
  { requestModels }
)(ModelMap);

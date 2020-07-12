import React from 'react';
import { connect } from 'react-redux';

import { requestModels } from '../actions/magma_actions';
import { selectModelNames, selectTemplate } from '../selectors/magma';

import ModelLink, { Arrowhead } from './model_map/model_link';
import ModelNode from './model_map/model_node';
import ModelReport from './model_map/model_report';
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
    this.setState( { current_model: model_name } )
  }
  render() {
    let [ width, height ] = [ 600, 600 ];
    let { templates, model_names } = this.props;
    let { current_model } = this.state;
    let layout = new Layout(current_model, templates, width, height);

    return <div id="model_map">
      <div className="map">
        <svg width={width} height={height}>
          <defs>
            <Arrowhead/>
          </defs>
          {
            model_names.map(
              model_name => {
                let node = layout.nodes[model_name];
                return <ModelLink key={model_name} center={ node.center }
                  parent={ node.model.parent && layout.nodes[node.model.parent] ? layout.nodes[node.model.parent].center : null }
                  size={ node.size }
                />
              }
            )
          }
        </svg>
        {
           model_names.map(
             model_name => {
               let node = layout.nodes[model_name];

               return <ModelNode
                 key={model_name}
                 center={ node.center }
                 size={ node.size }
                 selected={ current_model }
                 handler={ this.showModel.bind(this) }
                 model_name={ model_name }/>;
             }
           )
         }
      </div>
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

import React from 'react';
import { connect } from 'react-redux';

import { requestModels } from 'etna-js/actions/magma_actions';

import ModelReport from './model_map/model_report';
import ModelMapGraphic from './model_map/model_map_graphic';

import { selectProjects } from 'etna-js/selectors/janus-selector';
import { projectNameFull } from 'etna-js/utils/janus';
import {fetchProjectsAction} from 'etna-js/actions/janus-actions';

class ModelMap extends React.Component {
  constructor() {
    super()
    this.state = { current_model: "project", current_attribute: null }
  }
  componentDidMount() {
    this.props.requestModels();
    this.props.fetchProjectsAction();
  }
  showModel(current_model) {
    this.setState( { current_model, current_attribute: null } )
  }
  showAttribute(current_attribute) {
    this.setState( { current_attribute } )
  }
  render() {
    let [ width, height ] = [ 600, 600 ];
    let { projects } = this.props;
    let { current_model, current_attribute } = this.state;

    let full_name = projectNameFull(projects, CONFIG.project_name) || CONFIG.project_name

    return <div id="model_map">
      <div className="map">
        <div className="heading report_row">
        <span className="name">Project</span> <span className="title">{full_name}</span>
        </div>
        <ModelMapGraphic 
          width={width}
          height={height}
          current_model={current_model}
          handler={this.showModel.bind(this)}
        />
      </div>
      <ModelReport
        showAttribute={ this.showAttribute.bind(this) }
        model_name={ current_model } attribute_name={ current_attribute }/>
    </div>
  }
}

export default connect(
  (state) => {
    return {
      projects: selectProjects(state)
    }
  },
  { requestModels, fetchProjectsAction }
)(ModelMap);

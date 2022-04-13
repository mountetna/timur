import React, { useMemo, useCallback, useEffect, useState, useReducer } from 'react';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';

import AttributeReport from './model_map/attribute_report';

import MapHeading from './model_map/map_heading';
import ModelReport from './model_map/model_report';
import ModelMapGraphic from './model_map/model_map_graphic';

import { requestModels } from 'etna-js/actions/magma_actions';
import { selectTemplate } from 'etna-js/selectors/magma';
import { fetchProjectsAction } from 'etna-js/actions/janus-actions';
import { selectProjects } from 'etna-js/selectors/janus-selector';
import { projectNameFull } from 'etna-js/utils/janus';
import { useReduxState } from 'etna-js/hooks/useReduxState';
import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';

const mapStyle = makeStyles(theme => ({
  report: {
    borderLeft: '1px solid #bbb',
    height: 'calc(100vh - 61.5px)',
    flex: '1',
    width: 'auto',
    flexWrap: 'nowrap'
  },
  model_map: {
    position: 'relative'
  },
  map: {
    flexBasis: '600px'
  },
  heading: {
    position: 'absolute',
    left: '15px',
    top: '15px',
    width: '560px',
  }
}));

const countsReducer = (state, action) => {
  switch(action.type) {
    case 'MODEL_COUNT':
      return {
        ...state,
        [action.model_name]: {
          ...(state[action.model_name] || {}),
          count: action.count
        }
      };
    case 'ATTRIBUTE_COUNT':
      return {
        ...state,
        [action.model_name]: {
          ...(state[action.model_name] || {}),
          attributes: {
            ...state[action.model_name]?.attributes,
            [ action.attribute_name ]: action.count
          }
        }
      };
    default:
      return state;
  }
};

const ModelMap = ({}) => {
  const [ model, setModel ] = useState('project');
  const [ attribute_name, setAttribute ] = useState(null);
  const invoke = useActionInvoker();

  const state = useReduxState();
  const template = selectTemplate(state,model);
  const projects = selectProjects(state);

  const attribute = template && attribute_name ? template.attributes[attribute_name] : null;
  const updateModel = (model) => { setModel(model); setAttribute(null) };

  const [ counts, updateCounts ] = useReducer(countsReducer, {});

  useEffect( () => {
    invoke(requestModels());
    invoke(fetchProjectsAction());
  }, []);

  const [ width, height ] = [ 600, 600 ];

  const full_name = projectNameFull(projects, CONFIG.project_name) || CONFIG.project_name;

  const classes = mapStyle()

  return <Grid className={classes.model_map} container>
    <Grid item className="map">
      <MapHeading className={classes.heading} name='Project' title={full_name}/>
      <ModelMapGraphic 
        width={width}
        height={height}
        selected_models={[model]}
        handler={updateModel}
      />
    </Grid>
    <Grid container direction='column' className={ classes.report}>
      <ModelReport counts={counts} updateCounts={updateCounts} key={model} model_name={ model } template={ template } setAttribute={ setAttribute }/> 
      <AttributeReport counts={ counts[model] } attribute={ attribute } model_name={model}/> 
    </Grid>
  </Grid>
}

export default ModelMap;

import React, {useContext} from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';

import {makeStyles} from '@material-ui/core/styles';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectTemplate} from 'etna-js/selectors/magma';

import {QueryContext} from '../../contexts/query/query_context';
import QueryModelAttributeSelector from './query_model_attributes_selector';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  root: {
    minWidth: 345
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
}));

const QuerySelectPane = () => {
  const {state, setRootModel, setAttributes, clearRootModel} = useContext(
    QueryContext
  );
  const classes = useStyles();

  let reduxState = useReduxState();

  function onModelSelect(modelName: string, isRoot: boolean = false) {
    if (isRoot && '' === modelName) {
      clearRootModel();
    } else if (isRoot) {
      let template = selectTemplate(reduxState, modelName);
      setRootModel(modelName, {
        model_name: modelName,
        attribute_name: template.identifier,
        display_label: `${modelName}.${template.identifier}`
      });
    } else {
    }
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        title='Select'
        subheader='the models and attributes you want in your data frame'
      />
      <CardContent>
        <QueryModelAttributeSelector
          label='Root Model'
          modelValue={state.rootModel || ''}
          modelChoiceSet={
            state.graph && state.graph.allowedModels
              ? [...state.graph.allowedModels]
              : []
          }
          onSelectModel={(modelName) => onModelSelect(modelName, true)}
          onSelectAttributes={setAttributes}
          selectedAttributes={
            state.rootModel && state.attributes
              ? state.attributes[state.rootModel]
              : []
          }
        />
      </CardContent>
      <CardActions disableSpacing>
        {state.rootModel ? (
          <Tooltip
            title='Add intersection model'
            aria-label='add intersection model'
          >
            <IconButton aria-label='add model and attributes'>
              <AddIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </CardActions>
    </Card>
  );
};

export default QuerySelectPane;

// Generic filter component?
// Model, attribute, operator, operand

import React, {useContext, useCallback, useState, useEffect} from 'react';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectTemplate} from 'etna-js/selectors/magma';

import {QueryContext} from '../../contexts/query/query_context';
import {QueryFilter} from '../../contexts/query/query_types';
import {Attribute} from '../../models/model_types';
import {selectAllowedModelAttributes} from '../../selectors/query_selector';
import {visibleSortedAttributes} from '../../utils/attributes';

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
  },
  textInput: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  fullWidth: {
    width: '100%',
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

const QueryFilterControl = ({
  filter,
  patchFilter,
  removeFilter
}: {
  filter: QueryFilter;
  patchFilter: (filter: QueryFilter) => void;
  removeFilter: () => void;
}) => {
  const [modelAttributes, setModelAttributes] = useState([] as Attribute[]);
  const classes = useStyles();
  const {state} = useContext(QueryContext);
  let reduxState = useReduxState();

  useEffect(() => {
    initializeModelAttributes(filter.modelName);
  }, []);

  if (!state.rootModel) return null;

  const initializeModelAttributes = (modelName: string) => {
    if ('' !== modelName) {
      let template = selectTemplate(reduxState, modelName);
      setModelAttributes(
        selectAllowedModelAttributes(
          visibleSortedAttributes(template.attributes)
        )
      );
    }
  };

  const handleModelSelect = useCallback(
    (modelName: string) => {
      patchFilter({
        ...filter,
        modelName
      });
      initializeModelAttributes(modelName);
    },
    [filter, patchFilter]
  );

  const handleAttributeSelect = useCallback(
    (attributeName: string) =>
      patchFilter({
        ...filter,
        attributeName
      }),
    [filter, patchFilter]
  );

  const operatorOptions: {[key: string]: string} = {
    Equals: '::equals',
    Contains: '::matches',
    In: '::in',
    'Less than': '::<',
    'Greater than': '::>'
  };

  const magmifyOperator = useCallback(
    (operator: string) => operatorOptions[operator],
    [operatorOptions]
  );

  const prettifyOperator = useCallback(
    (operator: string) => _.invert(operatorOptions)[operator],
    [operatorOptions]
  );

  const handleOperatorSelect = useCallback(
    (operator: string) =>
      patchFilter({
        ...filter,
        operator: magmifyOperator(operator)
      }),
    [filter, patchFilter, magmifyOperator]
  );

  let handleOperandChange = useCallback(
    (operand: string) => {
      patchFilter({
        ...filter,
        operand
      });
    },
    [filter, patchFilter]
  );

  let modelNames = [...new Set(state.graph.allPaths(state.rootModel).flat())];

  let uniqId = useCallback(
    (idType: string): string =>
      `${idType}-Select-${Math.random().toString().substr(2, 8)}`,
    []
  );

  return (
    <Grid container>
      <Grid item xs={3}>
        <FormControl className={classes.formControl}>
          <InputLabel id={uniqId('model')}>Model</InputLabel>
          <Select
            labelId={uniqId('model')}
            value={filter.modelName}
            onChange={(e) => handleModelSelect(e.target.value as string)}
            displayEmpty
          >
            {modelNames.sort().map((name) => (
              <MenuItem value={name}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={3}>
        <FormControl className={classes.formControl}>
          <InputLabel id={uniqId('attribute')}>Attribute</InputLabel>
          {modelAttributes.length > 0 ? (
            <Select
              labelId={uniqId('attribute')}
              value={filter.attributeName}
              onChange={(e) => handleAttributeSelect(e.target.value as string)}
              displayEmpty
            >
              {modelAttributes.sort().map((attr) => (
                <MenuItem value={attr.attribute_name}>
                  {attr.attribute_name}
                </MenuItem>
              ))}
            </Select>
          ) : null}
        </FormControl>
      </Grid>
      <Grid item xs={2}>
        <FormControl className={classes.fullWidth}>
          <InputLabel id={uniqId('operator')}>Operator</InputLabel>
          <Select
            labelId={uniqId('operator')}
            value={prettifyOperator(filter.operator)}
            onChange={(e) => handleOperatorSelect(e.target.value as string)}
            displayEmpty
          >
            {Object.keys(operatorOptions)
              .sort()
              .map((operator: string) => (
                <MenuItem value={operator}>{operator}</MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={3}>
        <FormControl className={classes.formControl}>
          <TextField
            id={uniqId('operand')}
            label='Operand'
            value={filter.operand}
            onChange={(e) => handleOperandChange(e.target.value as string)}
          />
        </FormControl>
      </Grid>
      <Grid item xs={1}>
        <Tooltip title='Remove filter' aria-label='remove filter'>
          <IconButton aria-label='remove filter' onClick={removeFilter}>
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default QueryFilterControl;

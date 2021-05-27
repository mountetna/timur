// Generic filter component?
// Model, attribute, operator, operand

import React, {useContext, useCallback, useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectTemplate} from 'etna-js/selectors/magma';

import {QueryContext} from '../../contexts/query/query_context';
import {QueryFilter} from '../../contexts/query/query_types';
import {Attribute} from '../../models/model_types';
import {selectAllowedModelAttributes} from '../../selectors/query_selector';
import {visibleSortedAttributes} from '../../utils/attributes';
import _ from 'lodash';

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
  }
}));

const QueryFilterControl = ({
  filter,
  setFilter,
  removeFilter
}: {
  filter: QueryFilter | null;
  setFilter: (filter: QueryFilter) => void;
  removeFilter: () => void;
}) => {
  const [modelName, setModelName] = useState('');
  const [attributeName, setAttributeName] = useState('');
  const [operator, setOperator] = useState('');
  const [operand, setOperand] = useState('');
  const [modelAttributes, setModelAttributes] = useState([] as Attribute[]);
  const classes = useStyles();
  const {state} = useContext(QueryContext);

  useEffect(() => {
    if (
      [modelName, attributeName, operator, operand].every((val) => '' !== val)
    ) {
      setFilter({modelName, attributeName, operator, operand});
    }
  }, [modelName, attributeName, operator, operand]);

  useEffect(() => {
    if (null != filter) {
      setModelName(filter.modelName);
      setAttributeName(filter.attributeName);
      setOperator(prettifyOperator(filter.operator));
      setOperand(filter.operand);
    }
  }, []);

  if (!state.rootModel) return null;

  let reduxState = useReduxState();

  const handleModelSelect = useCallback(
    (modelName: string) => {
      setModelName(modelName);
      if ('' !== modelName) {
        let template = selectTemplate(reduxState, modelName);
        setModelAttributes(
          selectAllowedModelAttributes(
            visibleSortedAttributes(template.attributes)
          )
        );
      }
    },
    [reduxState]
  );

  const handleAttributeSelect = useCallback((attributeName: string) => {
    setAttributeName(attributeName);
  }, []);

  const operatorOptions: {[key: string]: string} = {
    Equals: '::equals',
    Contains: '::matches',
    In: '::in',
    'Less than': '::<',
    'Greater than': '::>'
  };

  const magmifyOperator = useCallback(
    (operator: string) => {
      return operatorOptions[operator];
    },
    [operatorOptions]
  );

  const prettifyOperator = useCallback(
    (operator: string) => {
      return _.invert(operatorOptions)[operator];
    },
    [operatorOptions]
  );

  const handleOperatorSelect = useCallback((operator: string) => {
    setOperator(magmifyOperator(operator));
  }, []);

  const handleOperandChange = useCallback((operand: string) => {
    setOperand(operand);
  }, []);

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
            value={modelName}
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
          <Select
            labelId={uniqId('attribute')}
            value={attributeName}
            onChange={(e) => handleAttributeSelect(e.target.value as string)}
            displayEmpty
          >
            {modelAttributes.sort().map((attr) => (
              <MenuItem value={attr.attribute_name}>
                {attr.attribute_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={3}>
        <FormControl className={classes.formControl}>
          <InputLabel id={uniqId('operator')}>Operator</InputLabel>
          <Select
            labelId={uniqId('operator')}
            value={prettifyOperator(operator)}
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
            defaultValue={operand}
            onChange={(e) => handleOperandChange(e.target.value as string)}
          />
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default QueryFilterControl;

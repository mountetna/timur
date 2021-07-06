// Generic filter component?
// Model, attribute, operator, operand

import React, {
  useMemo,
  useContext,
  useCallback,
  useState,
  useEffect
} from 'react';
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
import {
  selectAllowedModelAttributes,
  selectMatrixAttributes
} from '../../selectors/query_selector';
import {visibleSortedAttributesWithUpdatedAt} from '../../utils/attributes';

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
    minWidth: 120,
    paddingLeft: '1rem'
  },
  fullWidth: {
    width: '96%',
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

const QueryFilterControl = ({
  filter,
  modelNames,
  matrixAttributesOnly,
  hideModel,
  patchFilter,
  removeFilter
}: {
  filter: QueryFilter;
  modelNames: string[];
  matrixAttributesOnly?: boolean;
  hideModel?: boolean;
  patchFilter: (filter: QueryFilter) => void;
  removeFilter: () => void;
}) => {
  const classes = useStyles();
  const {state} = useContext(QueryContext);
  let reduxState = useReduxState();

  const modelAttributes = useMemo(() => {
    if ('' !== filter.modelName) {
      let template = selectTemplate(reduxState, filter.modelName);
      let sortedTemplateAttributes = visibleSortedAttributesWithUpdatedAt(
        template.attributes
      );

      if (matrixAttributesOnly) {
        return selectMatrixAttributes(
          sortedTemplateAttributes,
          state.attributes[filter.modelName]
        );
      } else {
        return selectAllowedModelAttributes(sortedTemplateAttributes);
      }
    }
    return [];
  }, [filter.modelName, state.attributes, reduxState, matrixAttributesOnly]);

  const attributeType = useMemo(() => {
    if ('' !== filter.attributeName) {
      let template = selectTemplate(reduxState, filter.modelName);

      switch (
        template.attributes[filter.attributeName].attribute_type.toLowerCase()
      ) {
        case 'string':
          return 'text';
        case 'datetime':
          return 'date';
        case 'integer':
        case 'float':
          return 'number';
        default:
          return 'text';
      }
    }
    return 'text';
  }, [filter.attributeName, filter.modelName, reduxState]);

  const handleModelSelect = useCallback(
    (modelName: string) => {
      patchFilter({
        modelName,
        attributeName: '',
        operator: '',
        operand: ''
      });
    },
    [patchFilter]
  );

  const handleAttributeSelect = useCallback(
    (attributeName: string) =>
      patchFilter({
        ...filter,
        attributeName
      }),
    [filter, patchFilter]
  );

  let operatorOptions: {[key: string]: string};

  if (matrixAttributesOnly) {
    operatorOptions = {
      Slice: '::slice'
    };
  } else {
    operatorOptions = {
      Equals: '::equals',
      Contains: '::matches',
      In: '::in',
      'Less than': '::<',
      'Greater than': '::>',
      'Is present': '::has',
      'Is missing': '::lacks'
    };
  }

  const noOperandOperators: string[] = ['::has', '::lacks'];

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
        operand: attributeType === 'number' ? parseFloat(operand) : operand
      });
    },
    [filter, patchFilter, attributeType]
  );

  let uniqId = (idType: string): string =>
    `${idType}-Select-${Math.random().toString()}`;

  if (!state.rootModel) return null;

  return (
    <Grid container>
      {!hideModel ? (
        <Grid item xs={3}>
          <FormControl className={classes.fullWidth}>
            <InputLabel id={uniqId('model')}>Model</InputLabel>
            <Select
              labelId={uniqId('model')}
              value={filter.modelName}
              onChange={(e) => handleModelSelect(e.target.value as string)}
              displayEmpty
            >
              {modelNames.sort().map((name, index: number) => (
                <MenuItem key={index} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      ) : null}
      <Grid item xs={3}>
        <FormControl className={classes.fullWidth}>
          <InputLabel id={uniqId('attribute')}>Attribute</InputLabel>
          {modelAttributes.length > 0 ? (
            <Select
              labelId={uniqId('attribute')}
              value={filter.attributeName}
              onChange={(e) => handleAttributeSelect(e.target.value as string)}
              displayEmpty
            >
              {modelAttributes.sort().map((attr, index: number) => (
                <MenuItem key={index} value={attr.attribute_name}>
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
            value={prettifyOperator(filter.operator) || ''}
            onChange={(e) => handleOperatorSelect(e.target.value as string)}
            displayEmpty
          >
            {Object.keys(operatorOptions)
              .sort()
              .map((operator: string, index: number) => (
                <MenuItem key={index} value={operator}>
                  {operator}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={3}>
        {noOperandOperators.includes(filter.operator) ? null : (
          <FormControl className={classes.textInput}>
            <TextField
              id={uniqId('operand')}
              label='Operand'
              value={filter.operand}
              onChange={(e) => handleOperandChange(e.target.value as string)}
            />
          </FormControl>
        )}
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

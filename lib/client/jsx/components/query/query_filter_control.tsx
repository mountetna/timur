// Generic filter component?
// Model, attribute, operator, operand

import React, {useMemo, useCallback} from 'react';
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

import {QueryFilter, QuerySlice} from '../../contexts/query/query_types';
import FilterOperator from './query_filter_operator';
import useFilterAttributes from './query_use_filter_attributes';
import {QueryGraph} from '../../utils/query_graph';

const useStyles = makeStyles((theme) => ({
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
  isColumnFilter,
  graph,
  patchFilter,
  removeFilter
}: {
  filter: QueryFilter | QuerySlice;
  modelNames: string[];
  isColumnFilter: boolean;
  graph: QueryGraph;
  patchFilter: (filter: QueryFilter | QuerySlice) => void;
  removeFilter: () => void;
}) => {
  const classes = useStyles();

  const {modelAttributes, attributeType} = useFilterAttributes({
    filter,
    graph
  });

  const filterOperator = useMemo(() => {
    return new FilterOperator(attributeType, filter.operator, isColumnFilter);
  }, [attributeType, filter.operator, isColumnFilter]);

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
        attributeName,
        operator: '',
        operand: ''
      }),
    [filter, patchFilter]
  );

  const handleOperatorSelect = useCallback(
    (operator: string) =>
      patchFilter({
        ...filter,
        operator: filterOperator.magmify(operator)
      }),
    [filter, patchFilter, filterOperator]
  );

  let handleOperandChange = useCallback(
    (operand: string) => {
      patchFilter({
        ...filter,
        operand: filterOperator.formatOperand(operand)
      });
    },
    [filter, patchFilter, filterOperator]
  );

  let uniqId = (idType: string): string =>
    `${idType}-Select-${Math.random().toString()}`;

  return (
    <Grid container>
      <Grid item xs={3}>
        <FormControl className={classes.fullWidth}>
          <InputLabel id={uniqId('model')}>Model</InputLabel>
          <Select
            labelId={uniqId('model')}
            value={filter.modelName}
            onChange={(e) => handleModelSelect(e.target.value as string)}
            displayEmpty
          >
            {modelNames.map((name, index: number) => (
              <MenuItem key={index} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
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
            value={filterOperator.prettify() || ''}
            onChange={(e) => handleOperatorSelect(e.target.value as string)}
            displayEmpty
          >
            {Object.keys(filterOperator.options())
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
        {filterOperator.hasOperand() ? (
          <FormControl className={classes.textInput}>
            <TextField
              id={uniqId('operand')}
              label='Operand'
              value={filter.operand}
              onChange={(e) => handleOperandChange(e.target.value as string)}
            />
          </FormControl>
        ) : null}
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

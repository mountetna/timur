// Generic filter component?
// Model, attribute, operator, operand

import React, {useMemo, useCallback, useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';

import {Debouncer} from 'etna-js/utils/debouncer';
import {
  QueryClause,
  QueryFilter,
  QuerySlice
} from '../../contexts/query/query_types';
import FilterOperator from './query_filter_operator';
import useFilterAttributes from './query_use_filter_attributes';
import {QueryGraph} from '../../utils/query_graph';

const useStyles = makeStyles((theme) => ({
  textInput: {},
  fullWidth: {
    width: '80%'
  }
}));

const QueryFilterClause = ({
  clause,
  clauseIndex,
  modelNames,
  isColumnFilter,
  graph,
  waitTime,
  eager,
  patchFilter,
  removeFilter
}: {
  clause: QueryClause;
  clauseIndex: number;
  modelNames: string[];
  isColumnFilter: boolean;
  graph: QueryGraph;
  waitTime?: number;
  eager?: boolean;
  patchFilter: (filter: QueryFilter | QuerySlice) => void;
  removeFilter: () => void;
}) => {
  const [operandValue, setOperandValue] = useState('' as string | number);
  const [previousOperandValue, setPreviousOperandValue] = useState(
    '' as string | number
  );
  const [debouncer, setDebouncer] = useState(
    () => new Debouncer({windowMs: waitTime, eager})
  );
  // Clear the existing debouncer and accept any new changes to the settings
  useEffect(() => {
    const debouncer = new Debouncer({windowMs: waitTime, eager});
    setDebouncer(debouncer);
    return () => debouncer.reset();
  }, [waitTime, eager]);

  const classes = useStyles();

  const {modelAttributes, attributeType} = useFilterAttributes({
    filter,
    graph
  });

  const filterOperator = useMemo(() => {
    return new FilterOperator(attributeType, filter.operator, isColumnFilter);
  }, [attributeType, filter.operator, isColumnFilter]);

  useEffect(() => {
    // When user selects a different attribute, update the type
    patchFilter({
      ...filter,
      attributeType
    });
  }, [filter.attributeName, attributeType]);

  const handleModelSelect = useCallback(
    (modelName: string) => {
      patchFilter({
        modelName,
        attributeName: '',
        clauses: [],
        attributeType: ''
      });
    },
    [patchFilter]
  );

  const handleAttributeSelect = useCallback(
    (attributeName: string) => {
      patchFilter({
        ...filter,
        attributeName,
        operator: '',
        operand: ''
      });
    },
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

  const handleOperandChange = useCallback(
    (operand: string) => {
      patchFilter({
        ...filter,
        operand: filterOperator.formatOperand(operand)
      });
    },
    [patchFilter, filter, filterOperator]
  );

  const handleOperandChangeWithDebounce = useCallback(
    (value: string) => {
      debouncer.ready(() => handleOperandChange(value));
      setOperandValue(value);
    },
    [handleOperandChange, debouncer]
  );

  // When the operand value changes, follow it
  useEffect(() => {
    if (filter.operand !== previousOperandValue) {
      debouncer.reset();
      setOperandValue(filter.operand);
      setPreviousOperandValue(filter.operand);
    }
  }, [filter.operand, debouncer, previousOperandValue]);

  let uniqId = (idType: string): string =>
    `${idType}-Select-${Math.random().toString()}`;

  return (
    <>
      <Grid item xs={3}>
        <FormControl className={classes.fullWidth}>
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
      <Grid item container xs={5} direction='column'>
        {filter.clauses.map((clause: QueryClause, index: number) => {
          return (
            <>
              <Grid item xs={2}>
                <FormControl className={classes.fullWidth}>
                  <Select
                    labelId={uniqId(`operator-${index}`)}
                    value={filterOperator.prettify() || ''}
                    onChange={(e) =>
                      handleOperatorSelect(e.target.value as string)
                    }
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
                      id={uniqId(`operand-${index}`)}
                      value={operandValue}
                      onChange={(e) =>
                        handleOperandChangeWithDebounce(
                          e.target.value as string
                        )
                      }
                    />
                  </FormControl>
                ) : null}
              </Grid>
            </>
          );
        })}
      </Grid>

      <Grid item xs={1} container justify='flex-end'>
        <Tooltip title='Remove filter' aria-label='remove filter'>
          <IconButton aria-label='remove filter' onClick={removeFilter}>
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </Grid>
    </>
  );
};
export default QueryFilterClause;

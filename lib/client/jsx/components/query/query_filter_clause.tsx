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
import {QueryClause} from '../../contexts/query/query_types';
import FilterOperator from './query_filter_operator';
import useQueryClause from './query_use_query_clause';
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
  modelName,
  graph,
  isColumnFilter,
  waitTime,
  eager,
  patchClause,
  removeClause
}: {
  clause: QueryClause;
  clauseIndex: number;
  modelName: string;
  graph: QueryGraph;
  isColumnFilter: boolean;
  waitTime?: number;
  eager?: boolean;
  patchClause: (clause: QueryClause) => void;
  removeClause: () => void;
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

  const {modelAttributes, attributeType} = useQueryClause({
    clause,
    modelName,
    graph
  });

  const filterOperator = useMemo(() => {
    return new FilterOperator(attributeType, clause.operator, isColumnFilter);
  }, [attributeType, clause.operator, isColumnFilter]);

  // useEffect(() => {
  //   // When user selects a different attribute, update the type
  //   patchClause({
  //     ...clause,
  //     attributeType
  //   });
  // }, [clause.attributeName, attributeType, clause, patchClause]);

  const handleAttributeSelect = useCallback(
    (attributeName: string) => {
      patchClause({
        ...clause,
        attributeName,
        operator: '',
        operand: ''
      });
    },
    [clause, patchClause]
  );

  const handleOperatorSelect = useCallback(
    (operator: string) =>
      patchClause({
        ...clause,
        operator: filterOperator.magmify(operator)
      }),
    [clause, patchClause, filterOperator]
  );

  const handleOperandChange = useCallback(
    (operand: string) => {
      patchClause({
        ...clause,
        operand: filterOperator.formatOperand(operand)
      });
    },
    [patchClause, clause, filterOperator]
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
    if (clause.operand !== previousOperandValue) {
      debouncer.reset();
      setOperandValue(clause.operand);
      setPreviousOperandValue(clause.operand);
    }
  }, [clause.operand, debouncer, previousOperandValue]);

  let uniqId = (idType: string): string =>
    `${idType}-Select-${Math.random().toString()}`;

  return (
    <Grid container spacing={1} alignItems='center'>
      <Grid item xs={4}>
        <FormControl className={classes.fullWidth}>
          {modelAttributes.length > 0 ? (
            <Select
              labelId={uniqId('attribute')}
              value={clause.attributeName}
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
      <Grid item xs={3}>
        <FormControl className={classes.fullWidth}>
          <Select
            labelId={uniqId(`operator-${clauseIndex}`)}
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
      <Grid item xs={4}>
        {filterOperator.hasOperand() ? (
          <FormControl className={classes.textInput}>
            <TextField
              id={uniqId(`operand-${clauseIndex}`)}
              value={operandValue}
              onChange={(e) =>
                handleOperandChangeWithDebounce(e.target.value as string)
              }
            />
          </FormControl>
        ) : null}
      </Grid>
      {!isColumnFilter ? (
        <Grid item xs={1} container justify='flex-end'>
          <Tooltip title='Remove clause' aria-label='remove clause'>
            <IconButton aria-label='remove clause' onClick={removeClause}>
              <ClearIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      ) : (
        <Grid item xs={1} />
      )}
    </Grid>
  );
};
export default QueryFilterClause;

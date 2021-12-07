// Generic filter component?
// Model, attribute, operator, operand

import React, {useMemo, useCallback, useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';

import {Debouncer} from 'etna-js/utils/debouncer';
import {QueryClause} from '../../contexts/query/query_types';
import {emptyQueryClauseStamp} from '../../selectors/query_selector';
import FilterOperator from './query_filter_operator';
import useQueryClause from './query_use_query_clause';
import {QueryGraph} from '../../utils/query_graph';
import RemoveIcon from './query_remove_icon';
import Selector from './query_selector';

const QueryFilterClause = ({
  clause,
  clauseIndex,
  modelNames,
  graph,
  isColumnFilter,
  waitTime,
  eager,
  patchClause,
  removeClause
}: {
  clause: QueryClause;
  clauseIndex: number;
  modelNames: string[];
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
  const [previousAttributeName, setPreviousAttributeName] = useState(
    clause.attributeName
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

  const {
    modelAttributes,
    attributeType,
    distinctAttributeValues,
    fetchDistinctAttributeValues
  } = useQueryClause({
    clause,
    graph
  });

  const filterOperator = useMemo(() => {
    return new FilterOperator({
      clause,
      isColumnFilter
    });
  }, [clause, isColumnFilter]);

  useEffect(() => {
    // When user selects a different attribute, update the type
    if (attributeType !== clause.attributeType) {
      patchClause({
        ...clause,
        attributeType
      });
    }
  }, [attributeType, clause, patchClause]);

  useEffect(() => {
    // When component loads, if clause already populated then
    //    fetch the pre-selected attribute values.
    if (
      '' !== clause.attributeName &&
      filterOperator.hasPrepopulatedOperandOptions()
    ) {
      fetchDistinctAttributeValues();
    }
  }, []);

  useEffect(() => {
    // When user selects a different attribute, update the pre-populated options
    if (
      previousAttributeName !== clause.attributeName &&
      '' !== clause.attributeName &&
      filterOperator.hasPrepopulatedOperandOptions()
    ) {
      setPreviousAttributeName(clause.attributeName);
      fetchDistinctAttributeValues();
    }
  }, [
    clause.attributeName,
    filterOperator,
    previousAttributeName,
    fetchDistinctAttributeValues
  ]);

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

  const handleModelSelect = useCallback(
    (modelName: string) => {
      patchClause(emptyQueryClauseStamp(modelName));
    },
    [patchClause]
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
      <Grid item xs={3}>
        <Selector
          canEdit={true}
          name={clause.modelName}
          onSelect={handleModelSelect}
          choiceSet={modelNames}
          label='model'
        />
      </Grid>
      <Grid item xs={3}>
        {modelAttributes.length > 0 ? (
          <Selector
            canEdit={true}
            label='attribute'
            name={clause.attributeName}
            onSelect={handleAttributeSelect}
            choiceSet={modelAttributes.map((a) => a.attribute_name)}
          />
        ) : null}
      </Grid>
      <Grid item xs={2}>
        <Selector
          label={`operator-${clauseIndex}`}
          canEdit={true}
          name={filterOperator.prettify() || ''}
          choiceSet={Object.keys(filterOperator.options())}
          onSelect={handleOperatorSelect}
        />
      </Grid>
      <Grid item xs={3}>
        {filterOperator.hasOperand() ? (
          <FormControl fullWidth>
            {filterOperator.hasPrepopulatedOperandOptions() &&
            distinctAttributeValues.length > 0 ? (
              <Autocomplete
                id={uniqId(`operand-${clauseIndex}`)}
                freeSolo
                fullWidth
                options={distinctAttributeValues}
                renderInput={(params) => <TextField {...params} />}
                onInputChange={(e, v, r) => {
                  // Only send event if user manually clears the value
                  //   or selects a non-empty-string option.
                  if ('' !== v || 'reset' !== r)
                    handleOperandChangeWithDebounce(v || '');
                }}
                inputValue={operandValue.toString()}
                data-testid='operand-autocomplete'
              />
            ) : (
              <TextField
                id={uniqId(`operand-${clauseIndex}`)}
                value={operandValue}
                onChange={(e) =>
                  handleOperandChangeWithDebounce(e.target.value as string)
                }
              />
            )}
          </FormControl>
        ) : null}
      </Grid>
      <Grid item xs={1} container justify='flex-end'>
        <RemoveIcon
          canEdit={!isColumnFilter}
          onClick={removeClause}
          label='clause'
        />
      </Grid>
    </Grid>
  );
};
export default QueryFilterClause;

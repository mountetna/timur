import React, {useMemo, useContext, useState, useCallback} from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import {QueryContext} from '../../contexts/query/query_context';
import QueryFilterControl from './query_filter_control';
import {QueryFilter, QuerySlice} from '../../contexts/query/query_types';
import QueryClause from './query_clause';
import QueryAnyEverySelectorList from './query_any_every_selector_list';

const QueryWherePane = () => {
  // Use an update counter to get the child components
  //  (i.e. the QueryFilterControls) to remount whenever
  //  the recordFilters list has one removed.
  // If not, the component rendered state gets confused
  //  because of non-unique keys.
  const [updateCounter, setUpdateCounter] = useState(0);
  const {
    state,
    addRecordFilter,
    removeRecordFilter,
    patchRecordFilter,
    setOrRecordFilterIndices
  } = useContext(QueryContext);

  function addNewRecordFilter() {
    addRecordFilter({
      modelName: '',
      attributeName: '',
      operator: '',
      operand: '',
      anyMap: {}
    });
  }

  const handlePatchFilter = useCallback(
    (
      index: number,
      updatedFilter: QueryFilter,
      originalFilter: QueryFilter
    ) => {
      if (
        state.rootModel &&
        updatedFilter.modelName !== originalFilter.modelName
      ) {
        let selectableModels = state.graph.sliceableModelNamesInPath(
          state.rootModel,
          updatedFilter.modelName
        );

        updatedFilter.anyMap = selectableModels.reduce(
          (acc: {[key: string]: boolean}, modelName: string) => {
            acc[modelName] = true;
            return acc;
          },
          {}
        );
      }
      patchRecordFilter(index, updatedFilter);
    },
    [patchRecordFilter, state.rootModel, state.graph]
  );

  function handleRemoveFilter(index: number) {
    removeRecordFilter(index);
    setUpdateCounter(updateCounter + 1);
  }

  const handleChangeOrFilters = useCallback(
    (index: number) => {
      let copy = [...state.orRecordFilterIndices];

      if (copy.includes(index)) copy.splice(copy.indexOf(index), 1);
      else copy.push(index);

      setOrRecordFilterIndices(copy);
    },
    [state.orRecordFilterIndices, setOrRecordFilterIndices]
  );

  const modelNames = useMemo(() => {
    if (!state.rootModel) return [];

    return [...new Set(state.graph.allPaths(state.rootModel).flat())];
  }, [state.graph, state.rootModel]);

  if (!state.rootModel) return null;

  return (
    <QueryClause title='Where'>
      {state.recordFilters.map((filter: QueryFilter, index: number) => (
        <Grid key={index} container alignItems='center' justify='center'>
          <Grid item xs={1}>
            <Checkbox
              checked={state.orRecordFilterIndices.includes(index)}
              color='primary'
              onChange={(e, checked) => handleChangeOrFilters(index)}
              inputProps={{'aria-label': 'secondary checkbox'}}
            />
          </Grid>
          <Grid item xs={2}>
            <QueryAnyEverySelectorList filter={filter} index={index} />
          </Grid>
          <Grid item container xs={9}>
            <QueryFilterControl
              key={`${index}-${updateCounter}`}
              filter={filter}
              modelNames={modelNames}
              patchFilter={(updatedFilter: QueryFilter | QuerySlice) =>
                handlePatchFilter(index, updatedFilter as QueryFilter, filter)
              }
              removeFilter={() => handleRemoveFilter(index)}
            />
          </Grid>
        </Grid>
      ))}
      <Button onClick={addNewRecordFilter} startIcon={<AddIcon />}>
        Filter
      </Button>
    </QueryClause>
  );
};

export default QueryWherePane;

import React, {useMemo, useContext, useState, useCallback} from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';

import {QueryContext} from '../../contexts/query/query_context';
import QueryFilterControl from './query_filter_control';
import {QueryFilter} from '../../contexts/query/query_types';
import QueryClause from './query_clause';

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
      operand: ''
    });
  }

  function handlePatchFilter(index: number, filter: QueryFilter) {
    patchRecordFilter(index, filter);
  }

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
    [state, state.orRecordFilterIndices]
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
            <Grid item container xs={11}>
              <QueryFilterControl
                key={`${index}-${updateCounter}`}
                filter={filter}
                modelNames={modelNames}
                patchFilter={(updatedFilter: QueryFilter) =>
                  handlePatchFilter(index, updatedFilter)
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

import React, {useCallback, useContext, useState} from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';

import {QueryContext} from '../../contexts/query/query_context';
import QueryFilterControl from './query_filter_control';
import {QueryFilter} from '../../contexts/query/query_types';

const QueryWherePane = () => {
  const [updateCounter, setUpdateCounter] = useState(0);
  const {
    state,
    addRecordFilter,
    removeRecordFilter,
    patchRecordFilter
  } = useContext(QueryContext);

  if (!state.rootModel) return null;

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

  return (
    <Card>
      <CardHeader title='Where' subheader='filter the records' />
      <CardContent>
        {state.recordFilters.map((filter: QueryFilter, index: number) => (
          <QueryFilterControl
            key={`${index}-${updateCounter}`}
            filter={filter}
            patchFilter={(updatedFilter: QueryFilter) =>
              handlePatchFilter(index, updatedFilter)
            }
            removeFilter={() => handleRemoveFilter(index)}
          />
        ))}
      </CardContent>
      <CardActions disableSpacing>
        <Tooltip title='Add filter' aria-label='add filter'>
          <IconButton aria-label='add filter' onClick={addNewRecordFilter}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default QueryWherePane;

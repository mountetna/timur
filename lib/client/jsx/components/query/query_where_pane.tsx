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
  const [whereFilters, setWhereFilters] = useState([] as QueryFilter[]);
  const {state, setRecordFilters} = useContext(QueryContext);

  if (!state.rootModel) return null;

  function addNewRecordFilter() {
    setWhereFilters(whereFilters.concat([null]));
  }

  function addRecordFilter(index: number, filter: QueryFilter) {
    let copy = [...whereFilters];
    copy[index] = filter;
    setWhereFilters(copy);
  }

  function removeRecordFilter(index: number) {
    let copy = [...whereFilters];
    copy.splice(index, 1);
    setWhereFilters(copy);
  }

  return (
    <Card>
      <CardHeader title='Where' subheader='filter the records' />
      <CardContent>
        {whereFilters.map((filter: QueryFilter, index: number) => (
          <QueryFilterControl
            filter={filter}
            setFilter={(updatedFilter: QueryFilter) =>
              addRecordFilter(index, updatedFilter)
            }
            removeFilter={() => removeRecordFilter(index)}
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

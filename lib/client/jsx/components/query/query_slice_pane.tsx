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

const QuerySlicePane = () => {
  // Use an update counter to get the child components
  //  (i.e. the QueryFilterControls) to remount whenever
  //  the slice list has one removed.
  // If not, the component rendered state gets confused
  //  because of non-unique keys.
  const [updateCounter, setUpdateCounter] = useState(0);
  const {state, addSlice, removeSlice, patchSlice} = useContext(QueryContext);

  if (!state.rootModel) return null;

  function addNewSlice() {
    addSlice({
      modelName: '',
      attributeName: '',
      operator: '',
      operand: ''
    });
  }

  function handlePatchSlice(index: number, filter: QueryFilter) {
    patchSlice(index, filter);
  }

  function handleRemoveSlice(index: number) {
    removeSlice(index);
    setUpdateCounter(updateCounter + 1);
  }

  return (
    <Card>
      <CardHeader
        title='Slice'
        subheader='table and matrix values out of the results'
      />
      <CardContent>
        {state.slices.map((filter: QueryFilter, index: number) => (
          <QueryFilterControl
            key={`${index}-${updateCounter}`}
            filter={filter}
            patchFilter={(updatedFilter: QueryFilter) =>
              handlePatchSlice(index, updatedFilter)
            }
            removeFilter={() => handleRemoveSlice(index)}
          />
        ))}
      </CardContent>
      <CardActions disableSpacing>
        <Tooltip title='Add slice' aria-label='add slice'>
          <IconButton aria-label='add slice' onClick={addNewSlice}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default QuerySlicePane;

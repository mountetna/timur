import React, {useMemo, useContext, useState} from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectModels} from 'etna-js/selectors/magma';

import {QueryContext} from '../../contexts/query/query_context';
import QueryFilterControl from './query_filter_control';
import {QueryFilter, QueryColumn} from '../../contexts/query/query_types';
import {
  selectSliceableModelNames,
  selectTableModelNames
} from '../../selectors/query_selector';

const QuerySlicePane = () => {
  // Use an update counter to get the child components
  //  (i.e. the QueryFilterControls) to remount whenever
  //  the slice list has one removed.
  // If not, the component rendered state gets confused
  //  because of non-unique keys.
  const [updateCounter, setUpdateCounter] = useState(0);
  const {state, addSlice, removeSlice, patchSlice} = useContext(QueryContext);

  let reduxState = useReduxState();

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

  const attributesWithRootIdentifier = useMemo(() => {
    if (!state.rootIdentifier || !state.rootModel) return {};

    return {
      ...state.attributes,
      [state.rootModel]: [...(state.attributes[state.rootModel] || [])].concat([
        state.rootIdentifier
      ])
    };
  }, [state.attributes, state.rootModel, state.rootIdentifier]);

  const modelNames = useMemo(() => {
    if (!state.rootModel) return [];

    return selectSliceableModelNames(
      selectModels(reduxState),
      attributesWithRootIdentifier
    );
  }, [
    state.attributes,
    state.rootModel,
    attributesWithRootIdentifier,
    reduxState
  ]);

  const tableModelNames = useMemo(() => {
    if (!state.rootModel) return [];

    return selectTableModelNames(
      selectModels(reduxState),
      Object.keys(attributesWithRootIdentifier)
    );
  }, [
    state.attributes,
    reduxState,
    state.rootModel,
    attributesWithRootIdentifier
  ]);

  if (!state.rootModel) return null;

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
            modelNames={modelNames}
            matrixAttributesOnly={!tableModelNames.includes(filter.modelName)}
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

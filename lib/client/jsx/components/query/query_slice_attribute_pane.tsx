import React, {useMemo, useContext, useState} from 'react';
import Grid from '@material-ui/core/Grid';
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

const QuerySliceAttributePane = ({
  modelName,
  attributeName
}: {
  modelName: string;
  attributeName?: string;
}) => {
  // All the slices related to a given model / attribute,
  //   with the model / attribute as a "label".
  // Tables will only have modelName.
  // Matrices will have modelName + attributeName.
  const [updateCounter, setUpdateCounter] = useState(0);
  const {state, addSlice, removeSlice, patchSlice} = useContext(QueryContext);

  let reduxState = useReduxState();

  function addNewSlice() {
    addSlice({
      modelName,
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
    <Grid container xs={12} spacing={1}>
      <Grid item xs={4}></Grid>
      <Grid item xs={7}>
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
      </Grid>
      <Grid item xs={1}>
        <Tooltip title='Add slice' aria-label='add slice'>
          <IconButton aria-label='add slice' onClick={addNewSlice}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default QuerySliceAttributePane;

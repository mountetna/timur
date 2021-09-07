import React, {useContext, useState, useMemo} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';

import {QueryContext} from '../../contexts/query/query_context';
import QueryFilterControl from './query_filter_control';
import {QuerySlice} from '../../contexts/query/query_types';
import useSliceMethods from './query_use_slice_methods';

const QuerySliceModelAttributePane = ({
  modelName,
  slices,
  isMatrix,
  removeSlice
}: {
  modelName: string;
  slices: QuerySlice[];
  isMatrix: boolean;
  removeSlice: (modelName: string, index: number) => void;
}) => {
  // All the slices related to a given model / attribute,
  //   with the model / attribute as a "label".
  // Matrices will have modelName + attributeName.
  const [updateCounter, setUpdateCounter] = useState(0);
  const {state} = useContext(QueryContext);

  const {addNewSlice, handlePatchSlice, handleRemoveSlice} = useSliceMethods(
    modelName,
    updateCounter,
    setUpdateCounter,
    removeSlice
  );

  if (!state.rootModel) return null;

  const modelNames = state.graph.sliceableModelNamesInPath(
    state.rootModel,
    modelName
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={1}>
        <Typography>Slices</Typography>
      </Grid>
      <Grid item xs={1}>
        <Tooltip
          title={`Add ${isMatrix ? 'matrix' : 'table'} slice`}
          aria-label={`Add ${isMatrix ? 'matrix' : 'table'} slice`}
        >
          <IconButton
            aria-label={`Add ${isMatrix ? 'matrix' : 'table'} slice`}
            onClick={() => addNewSlice(isMatrix ? '::slice' : '')}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item xs={10}>
        {slices
          ? slices.map((filter: QuerySlice, index: number) => (
              <QueryFilterControl
                key={`model-${modelName}-${index}-${updateCounter}`}
                filter={filter}
                modelNames={modelNames}
                matrixAttributesOnly={isMatrix}
                patchFilter={(updatedFilter: QuerySlice) =>
                  handlePatchSlice(index, updatedFilter)
                }
                removeFilter={() => handleRemoveSlice(index)}
              />
            ))
          : null}
      </Grid>
    </Grid>
  );
};

export default QuerySliceModelAttributePane;

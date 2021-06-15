import React, {useContext, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';

import {QueryContext} from '../../contexts/query/query_context';
import QueryFilterControl from './query_filter_control';
import {QueryFilter} from '../../contexts/query/query_types';
import useSliceMethods from './query_use_slice_methods';

const QuerySliceMatrixAttributePane = ({
  modelName,
  slices,
  isMatrix,
  removeSlice
}: {
  modelName: string;
  slices: QueryFilter[];
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

  return (
    <Grid container xs={12} spacing={1}>
      <Grid item xs={2}>
        <Typography>{modelName}</Typography>
      </Grid>
      <Grid item xs={9}>
        {slices
          ? slices.map((filter: QueryFilter, index: number) => (
              <QueryFilterControl
                key={`model-${modelName}-${index}-${updateCounter}`}
                filter={filter}
                modelNames={[modelName]}
                hideModel={true}
                matrixAttributesOnly={isMatrix}
                patchFilter={(updatedFilter: QueryFilter) =>
                  handlePatchSlice(index, updatedFilter)
                }
                removeFilter={() => handleRemoveSlice(index)}
              />
            ))
          : null}
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
    </Grid>
  );
};

export default QuerySliceMatrixAttributePane;

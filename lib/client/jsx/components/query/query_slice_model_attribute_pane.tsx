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
  removeSlice
}: {
  modelName: string;
  slices: QuerySlice[];
  removeSlice: (modelName: string, index: number) => void;
}) => {
  // All the slices related to a given model / attribute,
  //   with the model / attribute as a "label".
  // Matrices will have modelName + attributeName.
  const [updateCounter, setUpdateCounter] = useState(0);
  const {state} = useContext(QueryContext);

  const {matrixModelNames, addNewSlice, handlePatchSlice, handleRemoveSlice} =
    useSliceMethods(modelName, updateCounter, setUpdateCounter, removeSlice);

  let sliceableModelNames = useMemo(() => {
    if (!state.rootModel) return [];

    if (state.rootModel === modelName && matrixModelNames.includes(modelName)) {
      return [modelName];
    } else {
      return state.graph.sliceableModelNamesInPath(state.rootModel, modelName);
    }
  }, [state.rootModel, modelName, state.graph, matrixModelNames]);

  if (!state.rootModel) return null;

  return (
    <Grid container spacing={1}>
      <Grid item xs={1}>
        <Typography>Slices</Typography>
      </Grid>
      <Grid item xs={1}>
        <Tooltip title='Add slice' aria-label='Add slice'>
          <IconButton aria-label='Add slice' onClick={() => addNewSlice()}>
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
                isColumnFilter={true}
                modelNames={sliceableModelNames}
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

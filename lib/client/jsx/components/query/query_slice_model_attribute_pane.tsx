import React, {useContext, useState, useMemo} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';

import {QueryContext} from '../../contexts/query/query_context';
import QueryFilterControl from './query_filter_control';
import {QuerySlice, QueryColumn} from '../../contexts/query/query_types';
import useSliceMethods from './query_use_slice_methods';

const QuerySliceModelAttributePane = ({
  column,
  columnIndex
}: {
  column: QueryColumn;
  columnIndex: number;
}) => {
  // All the slices related to a given model / attribute,
  //   with the model / attribute as a "label".
  // Matrices will have modelName + attributeName.
  const [updateCounter, setUpdateCounter] = useState(0);
  const {state} = useContext(QueryContext);

  const {matrixModelNames, addNewSlice, handlePatchSlice, handleRemoveSlice} =
    useSliceMethods(column, columnIndex, updateCounter, setUpdateCounter);

  let sliceableModelNames = useMemo(() => {
    if (!state.rootModel) return [];

    if (
      state.rootModel === column.model_name &&
      matrixModelNames.includes(column.model_name)
    ) {
      return [column.model_name];
    } else {
      return state.graph.sliceableModelNamesInPath(
        state.rootModel,
        column.model_name
      );
    }
  }, [state.rootModel, column, state.graph, matrixModelNames]);

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
        {column.slices
          ? column.slices.map((slice: QuerySlice, index: number) => (
              <QueryFilterControl
                key={`model-${column.model_name}-${index}-${updateCounter}`}
                filter={slice}
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

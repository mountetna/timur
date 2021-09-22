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

const QuerySliceModelAttributePane = ({columnIndex}: {columnIndex: number}) => {
  // All the slices related to a given model / attribute,
  //   with the model / attribute as a "label".
  // Matrices will have modelName + attributeName.
  const [updateCounter, setUpdateCounter] = useState(0);
  const {
    state: {rootModel, graph, columns}
  } = useContext(QueryContext);

  const column = columns[columnIndex];
  const {matrixModelNames, addNewSlice, handlePatchSlice, handleRemoveSlice} =
    useSliceMethods(columnIndex, updateCounter, setUpdateCounter);

  let sliceableModelNames = useMemo(() => {
    if (!rootModel) return [];

    if (
      rootModel === column.model_name &&
      matrixModelNames.includes(column.model_name)
    ) {
      return [column.model_name];
    } else {
      return graph
        .sliceableModelNamesInPath(rootModel, column.model_name)
        .sort();
    }
  }, [rootModel, column, graph, matrixModelNames]);

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
        {column?.slices.map((slice: QuerySlice, index: number) => (
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
        ))}
      </Grid>
    </Grid>
  );
};

export default QuerySliceModelAttributePane;

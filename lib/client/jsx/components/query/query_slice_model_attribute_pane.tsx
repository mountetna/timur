import React, {useContext, useState, useMemo} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';

import {makeStyles} from '@material-ui/core/styles';

import {QueryGraphContext} from '../../contexts/query/query_graph_context';
import QueryFilterControl from './query_filter_control';
import {QuerySlice, QueryColumn} from '../../contexts/query/query_types';
import useSliceMethods from './query_use_slice_methods';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '0 0.5rem',
    marginBottom: '0.5rem'
  },
  grid: {
    paddingTop: '0.5rem'
  }
}));

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
  const {
    state: {graph, rootModel}
  } = useContext(QueryGraphContext);
  const classes = useStyles();

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
  }, [column, graph, rootModel, matrixModelNames]);

  return (
    <React.Fragment>
      <Tooltip title='Add slice' aria-label='Add slice'>
        <Button
          aria-label='Add slice'
          onClick={() => addNewSlice()}
          startIcon={<AddIcon />}
        >
          Add slice
        </Button>
      </Tooltip>
      <Grid container direction='column' className={classes.grid}>
        {column?.slices.map((slice: QuerySlice, index: number) => (
          <Paper className={classes.paper} key={index}>
            <Grid container spacing={1} alignItems='center'>
              <QueryFilterControl
                key={`model-${column.model_name}-${index}-${updateCounter}`}
                filter={slice}
                isColumnFilter={true}
                modelNames={sliceableModelNames}
                graph={graph}
                patchFilter={(updatedFilter: QuerySlice) =>
                  handlePatchSlice(index, updatedFilter)
                }
                removeFilter={() => handleRemoveSlice(index)}
              />
            </Grid>
          </Paper>
        ))}
      </Grid>
    </React.Fragment>
  );
};

export default QuerySliceModelAttributePane;

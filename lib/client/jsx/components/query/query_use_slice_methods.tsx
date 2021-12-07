import React, {useMemo, useCallback, useContext} from 'react';

import {QueryGraphContext} from '../../contexts/query/query_graph_context';
import {QueryColumnContext} from '../../contexts/query/query_column_context';
import {QuerySlice} from '../../contexts/query/query_types';
import {
  selectMatrixModelNames,
  selectCollectionModelNames,
  emptyQueryClauseStamp
} from '../../selectors/query_selector';

const useSliceMethods = (
  columnIndex: number,
  updateCounter: number,
  setUpdateCounter: React.Dispatch<React.SetStateAction<number>>
) => {
  const {
    state: {columns},
    patchQueryColumn
  } = useContext(QueryColumnContext);
  const {
    state: {graph, rootModel}
  } = useContext(QueryGraphContext);
  const column = useMemo(() => columns[columnIndex], [columns, columnIndex]);

  const addNewSlice = useCallback(() => {
    patchQueryColumn(columnIndex, {
      ...column,
      slices: [...(column.slices || [])].concat({
        modelName: '',
        clause: emptyQueryClauseStamp('')
      })
    });
  }, [patchQueryColumn, column, columnIndex]);

  const handlePatchSlice = useCallback(
    (sliceIndex: number, slice: QuerySlice) => {
      let updatedSlices = [...column.slices];
      updatedSlices[sliceIndex] = slice;
      patchQueryColumn(columnIndex, {
        ...column,
        slices: updatedSlices
      });
    },
    [patchQueryColumn, column, columnIndex]
  );

  const handleRemoveSlice = useCallback(
    (sliceIndex: number) => {
      let updatedSlices = [...column.slices];
      updatedSlices.splice(sliceIndex, 1);
      patchQueryColumn(columnIndex, {
        ...column,
        slices: updatedSlices
      });
      setUpdateCounter(updateCounter + 1);
    },
    [updateCounter, setUpdateCounter, patchQueryColumn, column, columnIndex]
  );

  const matrixModelNames = useMemo(() => {
    return selectMatrixModelNames(graph.models, columns);
  }, [graph, columns]);

  const collectionModelNames = useMemo(() => {
    if (!rootModel) return [];

    return selectCollectionModelNames(graph, rootModel, [
      ...new Set(columns.map((c) => c.model_name))
    ]);
  }, [graph, columns, rootModel]);

  return {
    handleRemoveSlice,
    handlePatchSlice,
    addNewSlice,
    matrixModelNames,
    collectionModelNames
  };
};

export default useSliceMethods;

import React, {useMemo, useCallback, useContext} from 'react';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectModels} from 'etna-js/selectors/magma';
import {QueryContext} from '../../contexts/query/query_context';
import {QuerySlice, QueryColumn} from '../../contexts/query/query_types';
import {
  selectMatrixModelNames,
  selectCollectionModelNames
} from '../../selectors/query_selector';

const useSliceMethods = (
  columnIndex: number,
  updateCounter: number,
  setUpdateCounter: React.Dispatch<React.SetStateAction<number>>
) => {
  let {
    state: {rootModel, columns, graph},
    patchQueryColumn
  } = useContext(QueryContext);
  const reduxState = useReduxState();
  const column = columns[columnIndex];

  const addNewSlice = useCallback(() => {
    patchQueryColumn(columnIndex, {
      ...column,
      slices: [...(column.slices || [])].concat({
        modelName: '',
        attributeName: '',
        operator: '',
        operand: ''
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

  const attributesWithRootIdentifier = useMemo(() => {
    if (!rootModel) return [];

    return [...columns];
  }, [columns, rootModel]);

  const matrixModelNames = useMemo(() => {
    if (!rootModel) return [];

    return selectMatrixModelNames(
      selectModels(reduxState),
      attributesWithRootIdentifier
    );
  }, [reduxState, rootModel, attributesWithRootIdentifier]);

  const collectionModelNames = useMemo(() => {
    if (!rootModel) return [];

    return selectCollectionModelNames(graph, rootModel, [
      ...new Set(columns.map((c) => c.model_name))
    ]);
  }, [graph, rootModel, columns]);

  return {
    handleRemoveSlice,
    handlePatchSlice,
    addNewSlice,
    matrixModelNames,
    collectionModelNames
  };
};

export default useSliceMethods;

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
  column: QueryColumn,
  columnIndex: number,
  updateCounter: number,
  setUpdateCounter: React.Dispatch<React.SetStateAction<number>>
) => {
  let {state, patchQueryColumn} = useContext(QueryContext);
  const reduxState = useReduxState();

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
    if (!state.rootIdentifier || !state.rootModel) return [];

    return [...state.columns].concat([state.rootIdentifier]);
  }, [state.columns, state.rootModel, state.rootIdentifier]);

  const matrixModelNames = useMemo(() => {
    if (!state.rootModel) return [];

    return selectMatrixModelNames(
      selectModels(reduxState),
      attributesWithRootIdentifier
    );
  }, [reduxState, state.rootModel, attributesWithRootIdentifier]);

  const collectionModelNames = useMemo(() => {
    if (!state.rootModel) return [];

    return selectCollectionModelNames(state.graph, state.rootModel, [
      ...new Set(state.columns.map((c) => c.model_name))
    ]);
  }, [state.graph, state.rootModel, state.columns]);

  return {
    handleRemoveSlice,
    handlePatchSlice,
    addNewSlice,
    matrixModelNames,
    collectionModelNames
  };
};

export default useSliceMethods;

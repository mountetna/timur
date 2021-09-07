import React, {useMemo, useCallback, useContext} from 'react';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectModels} from 'etna-js/selectors/magma';
import {QueryContext} from '../../contexts/query/query_context';
import {QuerySlice} from '../../contexts/query/query_types';
import {
  selectMatrixModelNames,
  selectCollectionModelNames,
  isMatrixSlice
} from '../../selectors/query_selector';

const useSliceMethods = (
  endModelName: string,
  updateCounter: number,
  setUpdateCounter: React.Dispatch<React.SetStateAction<number>>,
  removeSlice: (endModelName: string, index: number) => void
) => {
  let {state, addSlice, patchSlice} = useContext(QueryContext);
  const reduxState = useReduxState();

  const addNewSlice = useCallback(
    (operator: string) => {
      addSlice(endModelName, {
        modelName: '',
        attributeName: '',
        operator,
        operand: ''
      });
    },
    [addSlice, endModelName]
  );

  const handlePatchSlice = useCallback(
    (index: number, filter: QuerySlice) => {
      patchSlice(endModelName, index, filter);
    },
    [patchSlice, endModelName]
  );

  const handleRemoveSlice = useCallback(
    (index: number) => {
      removeSlice(endModelName, index);
      setUpdateCounter(updateCounter + 1);
    },
    [removeSlice, updateCounter, endModelName, setUpdateCounter]
  );

  const attributesWithRootIdentifier = useMemo(() => {
    if (!state.rootIdentifier || !state.rootModel) return {};

    return {
      ...state.attributes,
      [state.rootModel]: [...(state.attributes[state.rootModel] || [])].concat([
        state.rootIdentifier
      ])
    };
  }, [state.attributes, state.rootModel, state.rootIdentifier]);

  const matrixModelNames = useMemo(() => {
    if (!state.rootModel) return [];

    return selectMatrixModelNames(
      selectModels(reduxState),
      attributesWithRootIdentifier
    );
  }, [reduxState, state.rootModel, attributesWithRootIdentifier]);

  const collectionModelNames = useMemo(() => {
    if (!state.rootModel) return [];

    return selectCollectionModelNames(
      state.graph,
      state.rootModel,
      Object.keys(state.attributes)
    );
  }, [state.graph, state.rootModel, state.attributes]);

  const matrixSlices = useMemo(() => {
    if (!state.slices[endModelName] || !matrixModelNames.includes(endModelName))
      return [];

    return state.slices[endModelName].filter((slice) => isMatrixSlice(slice));
  }, [state.slices, endModelName, matrixModelNames]);

  const collectionSlices = useMemo(() => {
    if (
      !state.slices[endModelName] ||
      !collectionModelNames.includes(endModelName)
    )
      return [];

    return state.slices[endModelName];
  }, [state.slices, endModelName, collectionModelNames]);

  return {
    handleRemoveSlice,
    handlePatchSlice,
    addNewSlice,
    matrixModelNames,
    collectionModelNames,
    matrixSlices,
    collectionSlices
  };
};

export default useSliceMethods;

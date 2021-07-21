import React, {useMemo, useCallback, useContext} from 'react';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectModels} from 'etna-js/selectors/magma';
import {QueryContext} from '../../contexts/query/query_context';
import {QueryFilter} from '../../contexts/query/query_types';
import {
  selectMatrixModelNames,
  selectCollectionModelNames,
  isMatrixSlice
} from '../../selectors/query_selector';

const useSliceMethods = (
  modelName: string,
  updateCounter: number,
  setUpdateCounter: React.Dispatch<React.SetStateAction<number>>,
  removeSlice: (modelName: string, index: number) => void
) => {
  let {state, addSlice, patchSlice} = useContext(QueryContext);
  const reduxState = useReduxState();

  const addNewSlice = useCallback(
    (operator: string) => {
      addSlice({
        modelName,
        attributeName: '',
        operator,
        operand: ''
      });
    },
    [addSlice, modelName]
  );

  const handlePatchSlice = useCallback(
    (index: number, filter: QueryFilter) => {
      patchSlice(index, filter);
    },
    [patchSlice]
  );

  const handleRemoveSlice = useCallback(
    (index: number) => {
      removeSlice(modelName, index);
      setUpdateCounter(updateCounter + 1);
    },
    [removeSlice, updateCounter, modelName, setUpdateCounter]
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
    if (!state.slices[modelName] || !matrixModelNames.includes(modelName))
      return [];

    return state.slices[modelName].filter((slice) => isMatrixSlice(slice));
  }, [state.slices, modelName, matrixModelNames]);

  const collectionSlices = useMemo(() => {
    if (!state.slices[modelName] || !collectionModelNames.includes(modelName))
      return [];

    return state.slices[modelName];
  }, [state.slices, modelName, collectionModelNames]);

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

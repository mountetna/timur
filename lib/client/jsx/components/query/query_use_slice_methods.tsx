import React, {useCallback, useContext} from 'react';

import {QueryContext} from '../../contexts/query/query_context';
import {QueryFilter} from '../../contexts/query/query_types';

const useSliceMethods = (
  modelName: string,
  updateCounter: number,
  setUpdateCounter: React.Dispatch<React.SetStateAction<number>>,
  removeSlice: (modelName: string, index: number) => void
) => {
  let {addSlice, patchSlice} = useContext(QueryContext);

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
    [removeSlice, updateCounter, modelName]
  );

  return {
    handleRemoveSlice,
    handlePatchSlice,
    addNewSlice
  };
};

export default useSliceMethods;

import React, {useContext} from 'react';

import {QueryContext} from '../../contexts/query/query_context';
import QuerySliceModelAttributePane from './query_slice_model_attribute_pane';
import {QueryFilter} from '../../contexts/query/query_types';

const QuerySlicePane = ({
  modelName,
  slices,
  isMatrix,
  handleRemoveSlice
}: {
  modelName: string;
  slices: QueryFilter[];
  isMatrix: boolean;
  handleRemoveSlice: (modelName: string, index: number) => void;
}) => {
  const {state} = useContext(QueryContext);

  if (!state.rootModel) return null;

  return (
    <QuerySliceModelAttributePane
      slices={slices}
      modelName={modelName}
      isMatrix={isMatrix}
      removeSlice={handleRemoveSlice}
    />
  );
};

export default QuerySlicePane;

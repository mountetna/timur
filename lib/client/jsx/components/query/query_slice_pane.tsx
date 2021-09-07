import React, {useContext} from 'react';

import {QueryContext} from '../../contexts/query/query_context';
import QuerySliceModelAttributePane from './query_slice_model_attribute_pane';
import {QuerySlice} from '../../contexts/query/query_types';

const QuerySlicePane = ({
  modelName,
  slices,
  handleRemoveSlice
}: {
  modelName: string;
  slices: QuerySlice[];
  handleRemoveSlice: (modelName: string, index: number) => void;
}) => {
  const {state} = useContext(QueryContext);

  if (!state.rootModel) return null;

  return (
    <QuerySliceModelAttributePane
      slices={slices}
      modelName={modelName}
      removeSlice={handleRemoveSlice}
    />
  );
};

export default QuerySlicePane;

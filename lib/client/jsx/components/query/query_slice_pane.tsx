import React, {useContext} from 'react';

import {QueryContext} from '../../contexts/query/query_context';
import QuerySliceModelAttributePane from './query_slice_model_attribute_pane';
import {QueryColumn} from '../../contexts/query/query_types';

const QuerySlicePane = ({
  column,
  columnIndex
}: {
  column: QueryColumn;
  columnIndex: number;
}) => {
  const {state} = useContext(QueryContext);

  if (!state.rootModel) return null;

  return (
    <QuerySliceModelAttributePane column={column} columnIndex={columnIndex} />
  );
};

export default QuerySlicePane;

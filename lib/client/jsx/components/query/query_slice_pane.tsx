import React, {useContext} from 'react';

import {QueryContext} from '../../contexts/query/query_context';
import QuerySliceModelAttributePane from './query_slice_model_attribute_pane';

const QuerySlicePane = ({columnIndex}: {columnIndex: number}) => {
  const {
    state: {rootModel}
  } = useContext(QueryContext);

  if (!rootModel) return null;

  return <QuerySliceModelAttributePane columnIndex={columnIndex} />;
};

export default QuerySlicePane;

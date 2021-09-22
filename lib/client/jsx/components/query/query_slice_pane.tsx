import React from 'react';

import QuerySliceModelAttributePane from './query_slice_model_attribute_pane';

const QuerySlicePane = ({columnIndex}: {columnIndex: number}) => {
  return <QuerySliceModelAttributePane columnIndex={columnIndex} />;
};

export default QuerySlicePane;

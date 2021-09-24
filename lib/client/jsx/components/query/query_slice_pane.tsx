import React from 'react';

import {QueryColumn} from '../../contexts/query/query_types';
import QuerySliceModelAttributePane from './query_slice_model_attribute_pane';

const QuerySlicePane = React.memo(
  ({column, columnIndex}: {column: QueryColumn; columnIndex: number}) => {
    return (
      <QuerySliceModelAttributePane column={column} columnIndex={columnIndex} />
    );
  }
);

export default QuerySlicePane;

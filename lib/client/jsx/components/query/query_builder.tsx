import React, {useContext} from 'react';

import QueryControls from './query_controls';
import QueryResults from './query_results';
import {QueryGraphContext} from '../../contexts/query/query_graph_context';

import {QueryColumnProvider} from '../../contexts/query/query_column_context';
import {QueryWhereProvider} from '../../contexts/query/query_where_context';

const QueryBuilder = ({}) => {
  const {
    state: {graph}
  } = useContext(QueryGraphContext);

  if (!graph || !graph.initialized) return null;

  return (
    <QueryColumnProvider>
      <QueryWhereProvider>
        <QueryControls />
        <QueryResults />
      </QueryWhereProvider>
    </QueryColumnProvider>
  );
};

export default QueryBuilder;

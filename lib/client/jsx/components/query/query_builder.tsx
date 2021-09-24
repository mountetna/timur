import React, {useContext} from 'react';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import QueryControls from './query_controls';
import QueryResults from './query_results';
import {QueryGraphContext} from '../../contexts/query/query_graph_context';

import {QueryColumnProvider} from '../../contexts/query/query_column_context';
import {QueryWhereProvider} from '../../contexts/query/query_where_context';
import useQueryGraph from '../../contexts/query/use_query_graph';

const QueryBuilder = ({}) => {
  const {
    state: {graph},
    setGraph
  } = useContext(QueryGraphContext);
  const reduxState = useReduxState();

  useQueryGraph(reduxState, graph, setGraph);

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

import React, {useEffect} from 'react';

import {selectModels} from 'etna-js/selectors/magma';

import {QueryGraph} from '../../utils/query_graph';

const useQueryGraph = (reduxState: any, graph: QueryGraph, setGraph: any) => {
  useEffect(() => {
    let models = selectModels(reduxState);
    if (
      models &&
      Object.keys(models).length !== Object.keys(graph.models).length
    ) {
      let newGraph = new QueryGraph(models);
      setGraph(newGraph);
    }
  }, [reduxState, graph]);
};

export default useQueryGraph;

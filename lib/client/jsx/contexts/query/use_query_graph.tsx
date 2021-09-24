import React, {useEffect} from 'react';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectModels} from 'etna-js/selectors/magma';

import {QueryGraph} from '../../utils/query_graph';

const useQueryGraph = (graph: QueryGraph, setGraph: any) => {
  let reduxState = useReduxState();
  let models = selectModels(reduxState);

  useEffect(() => {
    if (
      models &&
      Object.keys(models).length !== Object.keys(graph.models).length
    ) {
      let newGraph = new QueryGraph(models);
      setGraph(newGraph);
    }
  }, [models, graph]);
};

export default useQueryGraph;

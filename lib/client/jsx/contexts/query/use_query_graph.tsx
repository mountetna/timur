import React, {useEffect} from 'react';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectModels} from 'etna-js/selectors/magma';

import {QueryGraph} from '../../utils/query_graph';

const useQueryGraph = (reduxState: any, graph: QueryGraph, setGraph: any) => {
  useEffect(() => {
    let models = selectModels(reduxState);
    console.log('models', models, reduxState);
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

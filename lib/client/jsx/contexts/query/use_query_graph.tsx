import React, {useEffect} from 'react';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectModels} from 'etna-js/selectors/magma';

import {QueryGraph} from '../../utils/query_graph';

const useQueryGraph = (setGraph: any) => {
  let reduxState = useReduxState();
  let models = selectModels(reduxState);

  useEffect(() => {
    if (models) {
      let newGraph = new QueryGraph(models);
      setGraph(newGraph);
    }
  }, [models]);
};

export default useQueryGraph;

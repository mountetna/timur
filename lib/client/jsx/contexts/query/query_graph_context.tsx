import React, {useState, createContext, useCallback} from 'react';

import {QueryGraph} from '../../utils/query_graph';
import useQueryGraph from './use_query_graph';

const defaultGraphState = {
  rootModel: null as string | null,
  graph: new QueryGraph({})
};

export type QueryGraphState = Readonly<typeof defaultGraphState>;

export const defaultGraphContext = {
  state: defaultGraphState as QueryGraphState,
  setRootModel: (modelName: string) => {},
  setGraph: (graph: QueryGraph) => {}
};

export type QueryGraphContextData = typeof defaultGraphContext;

export const QueryGraphContext = createContext(defaultGraphContext);
export type QueryGraphContext = typeof QueryGraphContext;
export type ProviderProps = {params?: {}; children: any};

export const QueryGraphProvider = (
  props: ProviderProps & Partial<QueryGraphContextData>
) => {
  const [state, setState] = useState(props.state || defaultGraphContext.state);

  const setRootModel = useCallback(
    (rootModel: string) => {
      setState({
        ...state,
        rootModel
      });
    },
    [state]
  );

  const setGraph = useCallback(
    (graph: QueryGraph) => {
      setState({
        ...state,
        graph
      });
    },
    [state]
  );

  useQueryGraph(state.graph, setGraph);

  return (
    <QueryGraphContext.Provider
      value={{
        state,
        setGraph,
        setRootModel
      }}
    >
      {props.children}
    </QueryGraphContext.Provider>
  );
};

import React, {useState, createContext, useCallback} from 'react';

export const defaultQueryParams = {
  rootModel: null as string | null
};

const defaultState = {
  ...defaultQueryParams
};

export type QueryState = Readonly<typeof defaultState>;

export const defaultContext = {
  state: defaultState as QueryState,
  setRootModel: (modelName: string) => {},
  clearRootModel: () => {}
};

export type QueryContextData = typeof defaultContext;

export const QueryContext = createContext(defaultContext);
export type QueryContext = typeof QueryContext;
export type ProviderProps = {params?: {}; children: any};

export const QueryProvider = (
  props: ProviderProps & Partial<QueryContextData>
) => {
  const [state, setState] = useState(props.state || defaultContext.state);

  const setRootModel = useCallback(
    (rootModel: string | null) => {
      setState({
        ...state,
        rootModel
      });
    },
    [state]
  );

  const clearRootModel = useCallback(() => {
    setState({
      ...state,
      rootModel: defaultQueryParams.rootModel
    });
  }, [state]);

  return (
    <QueryContext.Provider
      value={{
        state,
        setRootModel,
        clearRootModel
      }}
    >
      {props.children}
    </QueryContext.Provider>
  );
};

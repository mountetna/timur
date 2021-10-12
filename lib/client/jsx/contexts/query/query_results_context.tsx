import React, {useState, createContext, useCallback} from 'react';

import {QueryResponse} from './query_types';

export const defaultQueryResultsParams = {
  expandMatrices: true,
  flattenQuery: true,
  page: 0,
  pageSize: 10,
  data: {} as QueryResponse,
  numRecords: 0,
  queryString: ''
};

const defaultQueryResultsState = {
  ...defaultQueryResultsParams
};

export type QueryResultsState = Readonly<typeof defaultQueryResultsState>;

export const defaultQueryResultsContext = {
  state: defaultQueryResultsState as QueryResultsState,
  setExpandMatrices: (expandMatrices: boolean) => {},
  setFlattenQuery: (flattenQuery: boolean) => {},
  setPage: (page: number) => {},
  setPageSize: (pageSize: number) => {},
  setDataAndNumRecords: (data: QueryResponse, numRecords: number) => {},
  setQueryString: (queryString: string) => {},
  setResultsState: (newState: QueryResultsState) => {}
};

export type QueryResultsContextData = typeof defaultQueryResultsContext;

export const QueryResultsContext = createContext(defaultQueryResultsContext);
export type QueryResultsContext = typeof QueryResultsContext;
export type ProviderProps = {params?: {}; children: any};

export const QueryResultsProvider = (
  props: ProviderProps & Partial<QueryResultsContextData>
) => {
  const [state, setState] = useState(
    props.state || defaultQueryResultsContext.state
  );

  const setExpandMatrices = useCallback(
    (expandMatrices: boolean) => {
      return {
        ...state,
        expandMatrices
      };
    },
    [state]
  );

  const setFlattenQuery = useCallback(
    (flattenQuery: boolean) => {
      setState({
        ...state,
        flattenQuery
      });
    },
    [state]
  );

  const setPage = useCallback(
    (page: number) => {
      setState({
        ...state,
        page
      });
    },
    [state]
  );

  const setPageSize = useCallback(
    (pageSize: number) => {
      setState({
        ...state,
        pageSize
      });
    },
    [state]
  );

  const setDataAndNumRecords = useCallback(
    (data: QueryResponse, numRecords: number) => {
      setState({
        ...state,
        data,
        numRecords
      });
    },
    [state]
  );

  const setQueryString = useCallback(
    (queryString: string) => {
      setState({
        ...state,
        queryString
      });
    },
    [state]
  );

  const setResultsState = useCallback((newState: QueryResultsState) => {
    setState({
      ...newState
    });
  }, []);

  return (
    <QueryResultsContext.Provider
      value={{
        state,
        setExpandMatrices,
        setFlattenQuery,
        setPage,
        setPageSize,
        setDataAndNumRecords,
        setQueryString,
        setResultsState
      }}
    >
      {props.children}
    </QueryResultsContext.Provider>
  );
};

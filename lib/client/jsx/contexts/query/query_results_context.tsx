import React, {useState, createContext, useCallback} from 'react';

import {QueryResponse} from './query_types';

export const defaultQueryResultsParams = {
  expandMatrices: true,
  flattenQuery: true,
  lastPage: 0,
  page: 0,
  lastPageSize: 10,
  pageSize: 10,
  data: {} as QueryResponse,
  numRecords: 0
};

const defaultQueryResultsState = {
  ...defaultQueryResultsParams
};

export type QueryResultsState = Readonly<typeof defaultQueryResultsState>;

export const defaultQueryResultsContext = {
  state: defaultQueryResultsState as QueryResultsState,
  setExpandMatrices: (expandMatrices: boolean) => {},
  setFlattenQuery: (flattenQuery: boolean) => {},
  setLastPage: (lastPage: number) => {},
  setPage: (page: number) => {},
  setLastPageSize: (lastPageSize: number) => {},
  setPageSize: (pageSize: number) => {},
  setData: (data: QueryResponse) => {},
  setNumRecords: (numRecords: number) => {}
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
      return {
        ...state,
        flattenQuery
      };
    },
    [state]
  );

  const setLastPage = useCallback(
    (lastPage: number) => {
      return {
        ...state,
        lastPage
      };
    },
    [state]
  );

  const setPage = useCallback(
    (page: number) => {
      return {
        ...state,
        page
      };
    },
    [state]
  );

  const setLastPageSize = useCallback(
    (lastPageSize: number) => {
      return {
        ...state,
        lastPageSize
      };
    },
    [state]
  );

  const setPageSize = useCallback(
    (pageSize: number) => {
      return {
        ...state,
        pageSize
      };
    },
    [state]
  );

  const setData = useCallback(
    (data: QueryResponse) => {
      return {
        ...state,
        data
      };
    },
    [state]
  );

  const setNumRecords = useCallback(
    (numRecords: number) => {
      return {
        ...state,
        numRecords
      };
    },
    [state]
  );

  return (
    <QueryResultsContext.Provider
      value={{
        state,
        setExpandMatrices,
        setFlattenQuery,
        setLastPage,
        setPage,
        setLastPageSize,
        setPageSize,
        setData,
        setNumRecords
      }}
    >
      {props.children}
    </QueryResultsContext.Provider>
  );
};

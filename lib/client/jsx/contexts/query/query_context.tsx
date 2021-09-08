import React, {useState, createContext, useCallback} from 'react';

import {QueryFilter, QueryColumn, QuerySlice} from './query_types';

import {QueryGraph} from '../../utils/query_graph';

import useQueryGraph from './use_query_graph';

const defaultState = {
  columns: [] as QueryColumn[],
  rootModel: null as string | null,
  rootIdentifier: {} as QueryColumn | null,
  recordFilters: [] as QueryFilter[],
  orRecordFilterIndices: [] as number[],
  graph: {} as QueryGraph
};

export const defaultContext = {
  state: defaultState as QueryState,
  addQueryColumn: (column: QueryColumn) => {},
  removeQueryColumn: (index: number) => {},
  patchQueryColumn: (index: number, column: QueryColumn) => {},
  addRecordFilter: (recordFilter: QueryFilter) => {},
  removeRecordFilter: (index: number) => {},
  patchRecordFilter: (index: number, recordFilter: QueryFilter) => {},
  setOrRecordFilterIndices: (indices: number[]) => {},
  setRootModel: (
    model_name: string | null,
    model_identifier: QueryColumn | null
  ) => {}
};

export type QueryState = Readonly<typeof defaultState>;
export type QueryContextData = typeof defaultContext;

export const QueryContext = createContext(defaultContext);
export type QueryContext = typeof QueryContext;
export type ProviderProps = {params?: {}; children: any};

export const QueryProvider = (
  props: ProviderProps & Partial<QueryContextData>
) => {
  const [state, setState] = useState(props.state || defaultContext.state);

  const addQueryColumn = useCallback(
    (column: QueryColumn) => {
      setState({
        ...state,
        columns: [...(state.columns || [])].concat([column])
      });
    },
    [state]
  );

  const removeQueryColumn = useCallback(
    (index: number) => {
      let updatedQueryColumns = [...state.columns];
      updatedQueryColumns.splice(index, 1);
      setState({
        ...state,
        columns: updatedQueryColumns
      });
    },
    [state]
  );

  const patchQueryColumn = useCallback(
    (index: number, column: QueryColumn) => {
      let updatedQueryColumns = [...state.columns];
      updatedQueryColumns[index] = column;
      setState({
        ...state,
        columns: updatedQueryColumns
      });
    },
    [state]
  );

  const addRecordFilter = useCallback(
    (recordFilter: QueryFilter) => {
      setState({
        ...state,
        recordFilters: [...(state.recordFilters || [])].concat([recordFilter])
      });
    },
    [state]
  );

  const removeRecordFilter = useCallback(
    (filterIndex: number) => {
      let updatedRecordFilters = [...state.recordFilters];
      updatedRecordFilters.splice(filterIndex, 1);
      setState({
        ...state,
        recordFilters: updatedRecordFilters
      });
    },
    [state]
  );

  const patchRecordFilter = useCallback(
    (index: number, recordFilter: QueryFilter) => {
      let updatedRecordFilters = [...state.recordFilters];
      updatedRecordFilters[index] = recordFilter;
      setState({
        ...state,
        recordFilters: updatedRecordFilters
      });
    },
    [state]
  );

  const setOrRecordFilterIndices = useCallback(
    (orRecordFilterIndices: number[]) => {
      setState({
        ...state,
        orRecordFilterIndices
      });
    },
    [state]
  );

  const setRootModel = useCallback(
    (rootModel: string | null, rootIdentifier: QueryColumn | null) => {
      setState({
        ...state, // we want to keep state.graph!
        rootModel,
        rootIdentifier,
        columns: [],
        recordFilters: []
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

  useQueryGraph(setGraph);

  return (
    <QueryContext.Provider
      value={{
        state,
        addQueryColumn,
        removeQueryColumn,
        patchQueryColumn,
        addRecordFilter,
        removeRecordFilter,
        patchRecordFilter,
        setOrRecordFilterIndices,
        setRootModel
      }}
    >
      {props.children}
    </QueryContext.Provider>
  );
};

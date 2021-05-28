import React, {useState, createContext, useCallback} from 'react';

import {QueryFilter, QueryColumn} from './query_types';

import {QueryGraph} from '../../utils/query_graph';

import useQueryGraph from './use_query_graph';

const defaultState = {
  attributes: {} as {[key: string]: QueryColumn[]},
  rootModel: null as string | null,
  rootIdentifier: {} as QueryColumn | null,
  recordFilters: [] as QueryFilter[],
  slices: [] as QueryFilter[],
  graph: {} as QueryGraph
};

export const defaultContext = {
  state: defaultState as QueryState,
  setAttributes: (model_name: string, attributes: QueryColumn[]) => {},
  addRecordFilter: (recordFilter: QueryFilter) => {},
  removeRecordFilter: (index: number) => {},
  patchRecordFilter: (index: number, recordFilter: QueryFilter) => {},
  addSlice: (slice: QueryFilter) => {},
  removeSlice: (index: number) => {},
  patchSlice: (index: number, slice: QueryFilter) => (),
  setRootModel: (model_name: string, model_identifier: QueryColumn) => {},
  clearRootModel: () => {}
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

  function setAttributes(model_name: string, attributes: QueryColumn[]) {
    // Remove a model if no attributes
    let updatedAttributes = {...state.attributes};

    if (attributes.length > 0) {
      updatedAttributes[model_name] = attributes;
    } else {
      delete updatedAttributes[model_name];
    }

    setState({
      ...state,
      attributes: updatedAttributes
    });
  }

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

  const addSlice = useCallback(
    (slice: QueryFilter) => {
      setState({
        ...state,
        slices: [...(state.slices || [])].concat([slice])
      });
    },
    [state]
  );

  const removeSlice = useCallback(
    (index: number) => {
      let updatedSlices = [...state.slices];
      updatedSlices.splice(index, 1);
      setState({
        ...state,
        slices: updatedSlices
      });
    },
    [state]
  );

  const patchSlice = useCallback(
    (index: number, slice: QueryFilter) => {
      let updatedSlices = [...state.slices];
      updatedSlices[index] = slice;
      setState({
        ...state,
        slices: updatedSlices
      });
    },
    [state]
  );

  const setRootModel = useCallback(
    (rootModel: string, rootIdentifier: QueryColumn) => {
      setState({
        ...state,
        rootModel,
        rootIdentifier
      });
    },
    [state]
  );

  const clearRootModel = useCallback(() => {
    setState({
      ...state,
      rootModel: null,
      rootIdentifier: null,
      attributes: {},
      recordFilters: [],
      slices: []
    });
  }, [state]);

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
        setAttributes,
        addRecordFilter,
        removeRecordFilter,
        patchRecordFilter,
        addSlice,
        removeSlice,
        patchSlice,
        setRootModel,
        clearRootModel
      }}
    >
      {props.children}
    </QueryContext.Provider>
  );
};

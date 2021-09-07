import React, {useState, createContext, useCallback} from 'react';

import {QueryFilter, QueryColumn, QuerySlice} from './query_types';

import {QueryGraph} from '../../utils/query_graph';

import useQueryGraph from './use_query_graph';

const defaultState = {
  attributes: {} as {[key: string]: QueryColumn[]},
  rootModel: null as string | null,
  rootIdentifier: {} as QueryColumn | null,
  recordFilters: [] as QueryFilter[],
  orRecordFilterIndices: [] as number[],
  slices: {} as {[key: string]: QuerySlice[]},
  graph: {} as QueryGraph
};

export const defaultContext = {
  state: defaultState as QueryState,
  setAttributes: (model_name: string, attributes: QueryColumn[]) => {},
  addRecordFilter: (recordFilter: QueryFilter) => {},
  removeRecordFilter: (index: number) => {},
  patchRecordFilter: (index: number, recordFilter: QueryFilter) => {},
  setOrRecordFilterIndices: (indices: number[]) => {},
  addSlice: (endModelName: string, slice: QuerySlice) => {},
  removeSlice: (endModelName: string, index: number) => {},
  patchSlice: (endModelName: string, index: number, slice: QuerySlice) => {},
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

  const setAttributes = useCallback(
    (model_name: string, attributes: QueryColumn[]) => {
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

  const addSlice = useCallback(
    (endModelName: string, slice: QuerySlice) => {
      setState({
        ...state,
        slices: {
          ...state.slices,
          [endModelName]: [...(state.slices[endModelName] || [])].concat([
            slice
          ])
        }
      });
    },
    [state]
  );

  const removeSlice = useCallback(
    (endModelName: string, index: number) => {
      let updatedSlices = [...state.slices[endModelName]];
      updatedSlices.splice(index, 1);
      setState({
        ...state,
        slices: {
          ...state.slices,
          [endModelName]: updatedSlices
        }
      });
    },
    [state]
  );

  const patchSlice = useCallback(
    (endModelName: string, index: number, slice: QuerySlice) => {
      let updatedSlices = [...state.slices[endModelName]];
      updatedSlices[index] = slice;
      setState({
        ...state,
        slices: {
          ...state.slices,
          [endModelName]: updatedSlices
        }
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
        attributes: {},
        recordFilters: [],
        slices: {}
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
        setAttributes,
        addRecordFilter,
        removeRecordFilter,
        patchRecordFilter,
        setOrRecordFilterIndices,
        addSlice,
        removeSlice,
        patchSlice,
        setRootModel
      }}
    >
      {props.children}
    </QueryContext.Provider>
  );
};

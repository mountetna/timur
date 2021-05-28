import React, {useState, createContext, useCallback} from 'react';

import {QueryFilter, QueryColumn} from './query_types';

import {QueryGraph} from '../../utils/query_graph';

import useQueryGraph from './use_query_graph';

const defaultState = {
  attributes: {} as {[key: string]: QueryColumn[]},
  rootModel: null as string | null,
  rootIdentifier: {} as QueryColumn | null,
  recordFilters: [] as QueryFilter[],
  valueFilters: [] as QueryFilter[],
  graph: {} as QueryGraph
};

export const defaultContext = {
  state: defaultState as QueryState,
  setAttributes: (model_name: string, attributes: QueryColumn[]) => {},
  addRecordFilter: (recordFilter: QueryFilter) => {},
  removeRecordFilter: (index: number) => {},
  patchRecordFilter: (index: number, recordFilter: QueryFilter) => {},
  addValueFilter: (valueFilter: QueryFilter) => {},
  removeValueFilter: (index: number) => {},
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
      console.log('patching state', state, index, recordFilter);
      let updatedRecordFilters = [...state.recordFilters];
      updatedRecordFilters[index] = recordFilter;
      setState({
        ...state,
        recordFilters: updatedRecordFilters
      });
    },
    [state, state.recordFilters]
  );

  const addValueFilter = useCallback(
    (valueFilter: QueryFilter) => {
      setState({
        ...state,
        valueFilters: [...(state.valueFilters || [])].concat([valueFilter])
      });
    },
    [state]
  );

  const removeValueFilter = useCallback(
    (filterIndex: number) => {
      let updatedValueFilters = [...state.valueFilters];
      updatedValueFilters.splice(filterIndex, 1);
      setState({
        ...state,
        valueFilters: updatedValueFilters
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
      valueFilters: []
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
        addValueFilter,
        removeValueFilter,
        setRootModel,
        clearRootModel
      }}
    >
      {props.children}
    </QueryContext.Provider>
  );
};

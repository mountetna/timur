import React, {useState, createContext, useCallback} from 'react';

import {QueryFilter} from './query_types';

export const defaultQueryWhereParams = {
  recordFilters: [] as QueryFilter[],
  orRecordFilterIndices: [] as number[]
};

const defaultQueryWhereState = {
  ...defaultQueryWhereParams
};

export type QueryWhereState = Readonly<typeof defaultQueryWhereState>;

export const defaultQueryWhereContext = {
  state: defaultQueryWhereState as QueryWhereState,
  addRecordFilter: (recordFilter: QueryFilter) => {},
  removeRecordFilter: (index: number) => {},
  patchRecordFilter: (index: number, recordFilter: QueryFilter) => {},
  setOrRecordFilterIndices: (indices: number[]) => {},
  setWhereState: (newState: QueryWhereState) => {}
};

export type QueryWhereContextData = typeof defaultQueryWhereContext;

export const QueryWhereContext = createContext(defaultQueryWhereContext);
export type QueryWhereContext = typeof QueryWhereContext;
export type ProviderProps = {params?: {}; children: any};

export const QueryWhereProvider = (
  props: ProviderProps & Partial<QueryWhereContextData>
) => {
  const [state, setState] = useState(
    props.state || defaultQueryWhereContext.state
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

  const setWhereState = useCallback((newState: QueryWhereState) => {
    setState({
      ...newState
    });
  }, []);

  return (
    <QueryWhereContext.Provider
      value={{
        state,
        addRecordFilter,
        removeRecordFilter,
        patchRecordFilter,
        setOrRecordFilterIndices,
        setWhereState
      }}
    >
      {props.children}
    </QueryWhereContext.Provider>
  );
};

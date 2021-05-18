import {QueryState} from '../contexts/query/query_context';
import {QueryFilter} from '../contexts/query/query_types';
import {QueryGraph} from '../utils/query_graph';

export const selectQuerySelectedModels = (state: QueryState): string[] =>
  Object.keys(state.attributes);

export const selectQueryRecordFilters = (state: QueryState): QueryFilter[] =>
  state.recordFilters;

export const selectQueryValueFilters = (state: QueryState): QueryFilter[] =>
  state.valueFilters;

export const selectQueryLinkedModels = (
  state: QueryState,
  magmaModels: any
): string[] => {
  let {rootModel} = state;

  let graph = new QueryGraph(magmaModels);
  return [''];
};

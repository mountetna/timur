import {QueryState} from '../contexts/query/query_context';
import {QueryFilter} from '../contexts/query/query_types';
import {QueryGraph} from '../utils/query_graph';
import {Attribute} from '../models/model_types';

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

export const selectAllowedModelAttributes = (
  attributes: Attribute[]
): Attribute[] => {
  // I think we should force people to get these FK values
  //   from the other model, because generally people won't want
  //   the FK itself, just some attributes of the other model.
  const unallowedAttributeTypes = [
    'identifier',
    'parent',
    'child',
    'collection',
    'link',
    'table'
  ];
  return attributes.filter(
    (attr: Attribute) => !unallowedAttributeTypes.includes(attr.attribute_type)
  );
};

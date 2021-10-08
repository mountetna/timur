export interface QueryBase {
  modelName: string;
  attributeName: string;
  operator: string;
  operand: string | number;
  attributeType: string;
}

export interface QuerySlice extends QueryBase {}

export interface QueryFilterAnyMap {
  [modelName: string]: boolean;
}

export interface QueryFilter extends QueryBase {
  anyMap: QueryFilterAnyMap;
}

export interface QueryColumn {
  model_name: string;
  attribute_name: string;
  display_label: string;
  slices: QuerySlice[];
}

export interface QueryResponse {
  answer: any[];
  format: any[];
  type: string;
}

export const EmptyQueryResponse: QueryResponse = {
  answer: [],
  format: [],
  type: 'none'
};

export interface QueryTableColumn {
  label: string;
  colId: string;
}

export interface QueryBase {
  modelName: string;
  attributeName: string;
  operator: string;
  operand: string | number;
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

export interface QueryTableColumn {
  label: string;
  colId: string;
}

export interface QueryBase {
  modelName: string;
  attributeName: string;
  operator: string;
  operand: string | number;
}

export interface QuerySlice extends QueryBase {}

export interface QueryFilter extends QueryBase {
  anyMap: {[key: string]: boolean};
}

export interface QueryColumn {
  model_name: string;
  attribute_name: string;
  display_label: string;
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

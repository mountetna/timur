export interface QueryFilter {
  modelName: string;
  attributeName: string;
  operator: string;
  operand: string | number;
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

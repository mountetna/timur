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

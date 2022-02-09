import {Attribute} from 'etna-js/models/magma-model';

export interface QueryClause {
  attributeName: string;
  attributeType: string;
  operator: string;
  operand: string | number;
  modelName: string;
  any: boolean;
}

export const EmptyQueryClause: QueryClause = {
  attributeName: '',
  operator: '',
  operand: '',
  attributeType: '',
  modelName: '',
  any: true
};

export interface QueryBase {
  modelName: string;
}

export interface QuerySlice extends QueryBase {
  clause: QueryClause;
}

export interface QueryFilterAnyMap {
  [modelName: string]: boolean;
}

export interface QueryFilter extends QueryBase {
  anyMap: QueryFilterAnyMap;
  clauses: QueryClause[];
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
  modelName: string;
  attribute: Attribute;
  matrixHeadings: string[];
}

interface InputQueryMap {
  [key: string]: string;
}

export interface Workflow {
  name: string;
  displayName: string;
  icon?: string;
  inputQueryMap?: InputQueryMap;
}

export interface QueryPayload {
  query: string | any[];
  expand_matrices?: boolean;
  user_columns?: string[];
  transpose?: boolean;
  format?: string;
}

export interface CreateFigurePayload {
  title: string;
  inputs: {[key: string]: any};
}

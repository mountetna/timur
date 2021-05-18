export interface Validation {
  type: string;
  value: string | string[];
}

export interface Attribute {
  attribute_name: string;
  attribute_type: string;
  display_name: string;
  description?: string;
  hidden: boolean;
  name: string;
  read_only: boolean;
  restricted: boolean;
  validation: Validation | null;
  link_model_name?: string;
  model_name?: string;
}

export interface Template {
  name: string;
  identifier: string;
  parent: string;
  attributes: {[key: string]: Attribute};
}

export interface Model {
  documents: {[key: string]: any};
  revisions: {[key: string]: any};
  template: Template;
  views: {[key: string]: any};
}

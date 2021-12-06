import * as _ from 'lodash';

import {QueryClause} from '../../contexts/query/query_types';

export default class FilterOperator {
  isColumnFilter: boolean;
  clause: QueryClause;

  static queryOperatorsByType: {[key: string]: {[key: string]: string}} = {
    base: {
      'Is present': '::has',
      'Is missing': '::lacks'
    },
    boolean: {
      'Is true': '::true',
      'Is false': '::false',
      'Is untrue': '::untrue'
    },
    number: {
      In: '::in',
      Equals: '::=',
      'Greater than': '::>',
      'Greater than or equals': '::>=',
      'Less than': '::<',
      'Less than or equals': '::<=',
      'Not equals': '::!=',
      'Not in': '::notin'
    },
    date: {
      Equals: '::=',
      'Greater than': '::>',
      'Greater than or equals': '::>=',
      'Less than': '::<',
      'Less than or equals': '::<=',
      'Not equals': '::!='
    },
    text: {
      In: '::in',
      Equals: '::equals',
      Contains: '::matches',
      Not: '::not',
      'Not in': '::notin',
      'Greater than': '::>',
      'Greater than or equals': '::>=',
      'Less than': '::<',
      'Less than or equals': '::<='
    }
  };

  static columnOptionsByType: {[key: string]: {[key: string]: string}} = {
    matrix: {
      Slice: '::slice'
    }
  };

  static terminalOperators: string[] = ['::true', '::false', '::untrue'];

  static terminalInvertOperators: string[] = ['::has', '::lacks'];

  static commaSeparatedOperators: string[] = ['::in', '::slice', '::notin'];

  constructor({
    clause,
    isColumnFilter
  }: {
    clause: QueryClause;
    isColumnFilter: boolean;
  }) {
    this.clause = clause;
    this.isColumnFilter = isColumnFilter;
  }

  hasOperand(): boolean {
    return !(
      FilterOperator.terminalOperators.includes(this.clause.operator) ||
      FilterOperator.terminalInvertOperators.includes(this.clause.operator)
    );
  }

  hasPrepopulatedOperandOptions(): boolean {
    return (
      'string' === this.clause.attributeType && '' !== this.clause.attributeName
    );
  }

  attributeInputType(): string {
    switch (this.clause.attributeType) {
      case 'string':
        return 'text';
      case 'date_time':
        return 'date';
      case 'integer':
      case 'float':
      case 'number':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'matrix':
        return 'matrix';
      default:
        return 'text';
    }
  }

  optionsForAttribute(): {[key: string]: string} {
    return this.isColumnFilter &&
      this.attributeInputType() in FilterOperator.columnOptionsByType
      ? FilterOperator.columnOptionsByType[this.attributeInputType()]
      : this.attrOptionsWithBaseOptions();
  }

  attrOptionsWithBaseOptions(): {[key: string]: string} {
    return {
      ...FilterOperator.queryOperatorsByType.base,
      ...(FilterOperator.queryOperatorsByType[this.attributeInputType()] || {})
    };
  }

  prettify(): string {
    return _.invert(this.optionsForAttribute())[this.clause.operator];
  }

  magmify(newOperator: string): string {
    return this.optionsForAttribute()[newOperator];
  }

  options(): {[key: string]: string} {
    return this.optionsForAttribute();
  }

  formatOperand(operand: string): number | string {
    return operand;
  }
}

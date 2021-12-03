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

  static prepopulatedAttributes: {[key: string]: string[]} = {
    table: ['name']
  };

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
    if (null == this.clause.modelType) return false;

    return !!FilterOperator.prepopulatedAttributes[
      this.clause.modelType
    ]?.includes(this.clause.attributeName);
  }

  optionsForAttribute(): {[key: string]: string} {
    return this.isColumnFilter &&
      this.clause.attributeType in FilterOperator.columnOptionsByType
      ? FilterOperator.columnOptionsByType[this.clause.attributeType]
      : this.attrOptionsWithBaseOptions();
  }

  attrOptionsWithBaseOptions(): {[key: string]: string} {
    return {
      ...FilterOperator.queryOperatorsByType.base,
      ...(FilterOperator.queryOperatorsByType[this.clause.attributeType] || {})
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

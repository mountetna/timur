import * as _ from 'lodash';

export default class FilterOperator {
  attributeType: string;
  operator: string;
  isColumnFilter: boolean;

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

  constructor(
    attributeType: string,
    operator: string,
    isColumnFilter: boolean
  ) {
    this.attributeType = attributeType;
    this.operator = operator;
    this.isColumnFilter = isColumnFilter;
  }

  hasOperand(): boolean {
    return !(
      FilterOperator.terminalOperators.includes(this.operator) ||
      FilterOperator.terminalInvertOperators.includes(this.operator)
    );
  }

  optionsForAttribute(): {[key: string]: string} {
    return this.isColumnFilter &&
      this.attributeType in FilterOperator.columnOptionsByType
      ? FilterOperator.columnOptionsByType[this.attributeType]
      : this.attrOptionsWithBaseOptions();
  }

  attrOptionsWithBaseOptions(): {[key: string]: string} {
    return {
      ...FilterOperator.queryOperatorsByType.base,
      ...(FilterOperator.queryOperatorsByType[this.attributeType] || {})
    };
  }

  prettify(): string {
    return _.invert(this.optionsForAttribute())[this.operator];
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

import * as _ from 'lodash';

export default class FilterOperator {
  attributeType: string;
  operator: string;

  static allOptions: {[key: string]: string} = {
    Slice: '::slice',
    Equals: '::equals',
    Contains: '::matches',
    In: '::in',
    'Less than': '::<',
    'Greater than': '::>',
    'Is present': '::has',
    'Is missing': '::lacks',
    'Is true': '::true',
    'Is false': '::false',
    'Is untrue': '::untrue'
  };

  static terminalOperators: string[] = ['::true', '::false', '::untrue'];

  static terminalInvertOperators: string[] = ['::has', '::lacks'];

  static commaSeparatedOperators: string[] = ['::in', '::slice'];

  constructor(attributeType: string, operator: string) {
    this.attributeType = attributeType;
    this.operator = operator;
  }

  hasOperand(): boolean {
    return !(
      FilterOperator.terminalOperators.includes(this.operator) ||
      FilterOperator.terminalInvertOperators.includes(this.operator)
    );
  }

  prettify(): string {
    if (this.attributeType === 'number' && this.operator === '::=') {
      return 'Equals';
    }
    return _.invert(FilterOperator.allOptions)[this.operator];
  }

  magmify(newOperator: string): string {
    if (this.attributeType === 'number' && newOperator === 'Equals') {
      return '::=';
    }

    return FilterOperator.allOptions[newOperator];
  }

  options(isColumnFilter: boolean): {[key: string]: string} {
    console.log('in options', this.attributeType, isColumnFilter);
    if ('matrix' === this.attributeType && isColumnFilter) {
      return Object.keys(FilterOperator.allOptions).reduce(
        (acc: {[key: string]: string}, key: string) => {
          if ('Slice' === key) {
            acc[key] = FilterOperator.allOptions[key];
          }
          return acc;
        },
        {}
      );
    } else {
      return Object.keys(FilterOperator.allOptions).reduce(
        (acc: {[key: string]: string}, key: string) => {
          if ('Slice' !== key) {
            acc[key] = FilterOperator.allOptions[key];
          }
          return acc;
        },
        {}
      );
    }
  }

  formatOperand(operand: string): number | string {
    if (this.attributeType === 'number') return parseFloat(operand);
    else return operand;
  }
}

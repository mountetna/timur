import * as _ from 'lodash';

export default class FilterOperator {
  attributeType: string;
  operator: string;
  isColumnFilter: boolean;

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

  static allOptionsByType: {[key: string]: {[key: string]: string}} = {
    present: {
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
      'Not equals': '::!='
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
      Contains: '::matches'
    }
  };

  static columnOptionsByType: {[key: string]: {[key: string]: string}} = {
    matrix: {
      Slice: '::slice'
    }
  };

  static terminalOperators: string[] = ['::true', '::false', '::untrue'];

  static terminalInvertOperators: string[] = ['::has', '::lacks'];

  static commaSeparatedOperators: string[] = ['::in', '::slice'];

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

  optionsForFilterType(): {[key: string]: string} {
    return this.isColumnFilter &&
      this.attributeType in FilterOperator.columnOptionsByType
      ? FilterOperator.columnOptionsByType[this.attributeType]
      : this.optionsWithPresent();
  }

  optionsWithPresent(): {[key: string]: string} {
    return {
      ...FilterOperator.allOptionsByType.present,
      ...(FilterOperator.allOptionsByType[this.attributeType] || {})
    };
  }

  prettify(): string {
    return _.invert(this.optionsForFilterType())[this.operator];
  }

  magmify(newOperator: string): string {
    return this.optionsForFilterType()[newOperator];
  }

  options(): {[key: string]: string} {
    return this.optionsForFilterType();
  }

  formatOperand(operand: string): number | string {
    if (this.attributeType === 'number') return parseFloat(operand);
    else return operand;
  }
}

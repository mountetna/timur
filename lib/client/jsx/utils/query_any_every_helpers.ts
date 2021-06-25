import * as _ from 'lodash';

import {QueryFilter} from '../contexts/query/query_types';
import {getPath} from '../selectors/query_selector';

export const injectValueAtPath = (
  array: any[],
  valueInjectionPath: number[],
  value: any
) => {
  let currentValue = _.get(array, valueInjectionPath);

  _.set(array, valueInjectionPath, value);

  // We create a new injection path to inject a final "::any"
  //   after the value.
  let anyInjectionPath = [...valueInjectionPath];
  anyInjectionPath[valueInjectionPath.length - 1] =
    valueInjectionPath[valueInjectionPath.length - 1] + 1;
  if ('::any' === currentValue) _.set(array, anyInjectionPath, '::any');
};

const isAnyTuple = (target: [string, string]) => {
  return Array.isArray(target) && target.length === 2 && target[1] === '::any';
};

export const shouldInjectFilter = (filter: QueryFilter, path: any[]) => {
  // Should only inject data if the final array
  //   for the filter.modelName is an array with [modelName, '::any']
  // Otherwise no injection.
  let injectionPath = getPath(path, filter.modelName, []);
  let targetValue = _.get(path, injectionPath.slice(0, -1).join('.'));

  if (
    (isAnyTuple(targetValue) && targetValue[0] === filter.modelName) ||
    (isAnyTuple(path as [string, string]) && path[0] === filter.modelName)
  )
    return true;

  return false;
};

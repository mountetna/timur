import * as _ from 'lodash';

import {QueryBase} from '../contexts/query/query_types';
import {getPath} from '../selectors/query_selector';

export const nextInjectionPathItem = (injectionPath: number[]) => {
  let nextItemPath = [...injectionPath];
  nextItemPath[injectionPath.length - 1] =
    injectionPath[injectionPath.length - 1] + 1;

  return nextItemPath;
};

export const injectValueAtPath = (
  array: any[],
  valueInjectionPath: number[],
  value: any
) => {
  let currentValue = _.get(array, valueInjectionPath);
  if ('::any' === currentValue) {
    _.set(array, valueInjectionPath, value);

    // We create a new injection path to inject a final "::any"
    //   after the value.
    let anyInjectionPath = nextInjectionPathItem(valueInjectionPath);

    _.set(array, anyInjectionPath, '::any');

    return true;
  } else {
    // We need to "splice" in the values at the path...
    let refArray = array;
    valueInjectionPath.forEach((index: number) => {
      if (Array.isArray(refArray[index])) {
        refArray = refArray[index];
      } else {
        // We are at the injection spot
        refArray.splice(index, 0, ...value);
      }
    });

    return false;
  }
};

const isModelWithAny = (
  path: any[],
  injectionPath: number[],
  filter: QueryBase
) => {
  let nextItemPath = nextInjectionPathItem(injectionPath);

  return (
    _.get(path, injectionPath.join('.')) === filter.modelName &&
    _.get(path, nextItemPath.join('.')) === '::any'
  );
};

export const shouldInjectFilter = (filter: QueryBase, path: any[]) => {
  // Should only inject data if the final array
  //   for the filter.modelName is an array with [modelName, '::any']
  // Otherwise no injection.
  let injectionPath = getPath(path, filter.modelName, []);
  if (isModelWithAny(path, injectionPath, filter)) return true;

  return false;
};

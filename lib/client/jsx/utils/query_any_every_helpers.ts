import * as _ from 'lodash';

const anyOrEvery = ['::any', '::every'];

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
  if (anyOrEvery.includes(currentValue)) {
    _.set(array, valueInjectionPath, value);

    // We create a new injection path to inject a final "::any" or "::every"
    //   after the value.
    let anyInjectionPath = nextInjectionPathItem(valueInjectionPath);

    _.set(array, anyInjectionPath, currentValue);

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

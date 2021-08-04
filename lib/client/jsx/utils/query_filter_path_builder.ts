import * as _ from 'lodash';
import {Model} from '../models/model_types';
import {stepIsOneToMany} from '../selectors/query_selector';
import {injectValueAtPath} from './query_any_every_helpers';
import {QueryFilterAnyMap} from '../contexts/query/query_types';

export default class QueryFilterPathBuilder {
  path: string[];
  models: {[key: string]: Model};
  rootModelName: string;
  anyMap: QueryFilterAnyMap;

  constructor(
    path: string[],
    rootModelName: string,
    models: {[key: string]: Model},
    anyMap: QueryFilterAnyMap
  ) {
    this.path = path;
    this.models = models;
    this.rootModelName = rootModelName;
    this.anyMap = anyMap;
  }

  build(): any[] {
    let updatedPath: any[] = [];
    let previousModelName = this.rootModelName;
    let filterAnyPath: any[] = [];
    let nestedFilterIndex: number = 0;

    this.path.forEach((modelName: string) => {
      if (stepIsOneToMany(this.models, previousModelName, modelName)) {
        let newValue = [
          modelName,
          this.anyMap[modelName] ? '::any' : '::every'
        ];
        if (updatedPath.length === 0) {
          updatedPath.push(...newValue);
        } else {
          // here we'll nest with ::any
          filterAnyPath.push(nestedFilterIndex);
          let injected = injectValueAtPath(
            updatedPath,
            filterAnyPath,
            newValue
          );

          if (injected) {
            // Reset this so we re-index for the new, nested array.
            nestedFilterIndex = 0;
          } else {
            // the value was not injected but rather spliced inline,
            //   so we increment the nestedFilterIndex and pop
            //   the last value off the filterAnyPath.
            filterAnyPath.pop();
          }
        }
      } else {
        updatedPath.push(modelName);
      }
      previousModelName = modelName;
      nestedFilterIndex++;
    });
    return updatedPath;
  }
}

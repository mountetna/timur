import * as _ from 'lodash';
import {Model} from '../models/model_types';
import {stepIsOneToMany} from '../selectors/query_selector';
import {injectValueAtPath} from './query_any_every_helpers';

export default class QueryFilterPathBuilder {
  path: string[];
  models: {[key: string]: Model};
  rootModelName: string;

  constructor(
    path: string[],
    rootModelName: string,
    models: {[key: string]: Model}
  ) {
    this.path = path;
    this.models = models;
    this.rootModelName = rootModelName;
  }

  build(): any[] {
    let updatedPath: any[] = [];
    let previousModelName = this.rootModelName;
    let filterAnyPath: any[] = [];
    let nestedFilterIndex: number = 0;

    this.path.forEach((modelName: string) => {
      if (stepIsOneToMany(this.models, previousModelName, modelName)) {
        let newValue = [modelName, '::any'];
        if (updatedPath.length === 0) {
          updatedPath.push(...newValue);
        } else {
          // here we'll nest with ::any
          filterAnyPath.push(nestedFilterIndex);
          injectValueAtPath(updatedPath, filterAnyPath, newValue);
          // Reset this so we re-index for the new, nested array.
          nestedFilterIndex = 0;
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
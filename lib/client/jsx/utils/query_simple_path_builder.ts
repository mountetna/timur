import {Model} from '../models/model_types';
import {stepIsOneToMany} from '../selectors/query_selector';

export default class QuerySimplePathBuilder {
  path: string[];
  models: {[key: string]: Model};
  flatten: boolean;
  rootModelName: string;

  constructor(
    path: string[],
    rootModelName: string,
    models: {[key: string]: Model},
    flatten: boolean
  ) {
    this.path = path;
    this.models = models;
    this.flatten = flatten;
    this.rootModelName = rootModelName;
  }

  reducerVerb() {
    return this.flatten ? '::first' : '::all';
  }

  build(): any[] {
    let updatedPath: any[] = [];
    let previousModelName = this.rootModelName;

    this.path.forEach((modelName: string) => {
      if (stepIsOneToMany(this.models, previousModelName, modelName)) {
        updatedPath.push(modelName);
        updatedPath.push(this.reducerVerb());
      } else {
        updatedPath.push(modelName);
      }
      previousModelName = modelName;
    });

    return updatedPath;
  }
}

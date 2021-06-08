import {QueryColumn, QueryFilter} from '../contexts/query/query_types';
import {QueryGraph} from './query_graph';

export class QueryBuilder {
  graph: QueryGraph;
  recordFilters: QueryFilter[] = [];
  slices: QueryFilter[] = [];
  attributes: {[key: string]: QueryColumn[]} = {};
  root: string = '';

  constructor(graph: QueryGraph) {
    this.graph = graph;
  }

  addRootIdentifier(rootIdentifier: QueryColumn) {
    this.root = rootIdentifier.model_name;
    if (!this.attributes.hasOwnProperty(this.root)) {
      this.attributes[this.root] = [rootIdentifier];
    } else {
      this.attributes[this.root].splice(0, 0, rootIdentifier);
    }
  }

  addAttributes(attributes: {[key: string]: QueryColumn[]}) {
    // For all attributes, we need to update them with the path
    //   from this.root to the given attribute model.
    Object.entries(attributes).forEach(
      ([modelName, selectedAttributes]: [string, QueryColumn[]]) => {
        if (!this.attributes.hasOwnProperty(modelName))
          this.attributes[modelName] = [];
      }
    );
  }

  query(): any[] {
    // THIS IS A STUB
    // TODO: it's not really like this!
    return [this.root, this.recordFilters, this.attributes, this.slices];
  }

  pathToModel(targetModel: string): string[] {
    let path = this.graph
      .pathsFrom(this.root)
      .find((potentialPath: string[]) => potentialPath.includes(targetModel));

    if (!path) throw `No path from ${this.root} to ${targetModel}.`;
    return path;
  }

  joinAttributesSlices(): string[][] {
    // Convert this.attributes + this.slices into the right
    //   query format
  }
}

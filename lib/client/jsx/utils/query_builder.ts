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
    this.attributes[this.root] = [rootIdentifier];
  }

  addAttributes(attributes: {[key: string]: QueryColumn[]}) {
    // For all attributes, we need to update them with the path
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
  }

  joinAttributesSlices(): string[][] {
    // Convert this.attributes + this.slices into the right
    //   query format
  }
}

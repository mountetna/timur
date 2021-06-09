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
    Object.entries(attributes).forEach(
      ([modelName, selectedAttributes]: [string, QueryColumn[]]) => {
        if (!this.attributes.hasOwnProperty(modelName))
          this.attributes[modelName] = [];

        this.attributes[modelName] = this.attributes[modelName].concat(
          selectedAttributes
        );
      }
    );
  }

  addRecordFilters(recordFilters: QueryFilter[]) {
    this.recordFilters = recordFilters;
  }

  addSlices(slices: QueryFilter[]) {
    this.slices = slices;
  }

  query(): any[] {
    return [
      this.root,
      ...this.expandedOperands(this.recordFilters),
      '::all',
      this.joinAttributesSlices()
    ];
  }

  expandOperand(
    filter: QueryFilter,
    includeModelName: boolean = true
  ): (string | string[])[] {
    let clone: {[key: string]: string | string[]} = {...filter};
    let result: (string | string[])[] = [];

    if (includeModelName) result.push(clone.modelName);

    result.push(clone.attributeName);
    result.push(clone.operator);

    if (filter.operator === '::in' || filter.operator === '::slice') {
      clone.operand = (clone.operand as string).split(',');
    }

    result.push(clone.operand);

    return result;
  }

  expandedOperands(filters: QueryFilter[]) {
    return filters.map((filter) =>
      this.expandOperand(filter, this.root !== filter.modelName)
    );
  }

  pathToModel(targetModel: string): string[] | undefined {
    let path = this.graph
      .allPaths(this.root)
      .find((potentialPath: string[]) => potentialPath.includes(targetModel));

    if (!path)
      console.error(`No path from ${this.root} to ${targetModel}. Ignoring.`);

    return path?.slice(0, path.indexOf(targetModel) + 1);
  }

  // Type should be some sort of arbitrarily nested string array
  //   [
  //     ['name'],
  //     ['species'],
  //     ['labor', 'year'],
  //     ['labor', 'completed'],
  //     ['labor', 'prize', ['name', '::equals', 'Sparta'], '::first', 'value']
  //   ]
  joinAttributesSlices(): (string | string[] | (string | string[])[])[] {
    // Convert this.attributes + this.slices into the right
    //   query format. Include the path from the root model
    //   to the attributes' model.
    let initialValues = this.attributes[this.root].map((attr) => [
      attr.attribute_name
    ]);

    return Object.entries(this.attributes).reduce(
      (
        acc: (string | string[] | (string | string[])[])[],
        [modelName, attributes]: [string, QueryColumn[]]
      ) => {
        if (modelName === this.root) return acc;

        let path = this.pathToModel(modelName);

        if (!path) return acc;

        attributes.forEach((attr) => {
          acc.push(
            this.predicateWithSlice(path as string[], attr) as (
              | string
              | string[]
            )[]
          );
        });

        return acc;
      },
      [...initialValues]
    );
  }

  predicateWithSlice(
    path: string[],
    attribute: QueryColumn
  ): (string | string[] | (string | string[])[])[] {
    // If there is a slice associated with this predicate, we'll
    // inject it here.
    let matchingSlice = this.slices.find(
      (slice) => slice.modelName === attribute.model_name
    );

    let predicate: (string | string[] | (string | string[])[])[] = [...path];

    if (matchingSlice) {
      predicate.push(this.expandOperand(matchingSlice, false));
      predicate.push('::first');
    }

    predicate.push(attribute.attribute_name);
    return predicate;
  }
}

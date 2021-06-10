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

  query(flatten: boolean = true): any[] {
    return [
      this.root,
      ...this.expandedOperands(this.recordFilters),
      '::all',
      this.joinAttributesSlices(flatten)
    ];
  }

  count(): any[] {
    return [this.root, ...this.expandedOperands(this.recordFilters), '::count'];
  }

  expandOperand(
    filter: QueryFilter,
    includeModelPath: boolean = true
  ): (string | string[] | number)[] {
    let clone: {
      modelName: string;
      attributeName: string;
      operator: string;
      operand: string | string[] | number;
    } = {...filter};
    let result: (string | string[] | number)[] = [];

    if (includeModelPath && undefined != this.pathToModel(clone.modelName))
      result.push(...(this.pathToModel(clone.modelName) as string[]));

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

    // if (!path)
    //   console.error(`No path from ${this.root} to ${targetModel}. Ignoring.`);

    // Direct children paths include the root, so
    //   we'll filter it out
    return path
      ?.slice(0, path.indexOf(targetModel) + 1)
      .filter((m) => m !== this.root);
  }

  // Type should be some sort of arbitrarily nested string array,
  //   but not sure how to correctly specify all the possible permutations.
  //   [
  //     ['name'],
  //     ['species'],
  //     ['labor', 'year'],
  //     ['labor', 'completed'],
  //     ['labor', 'prize', ['name', '::equals', 'Sparta'], '::first', 'value']
  //   ]
  joinAttributesSlices(
    flatten: boolean = true
  ): (string | string[] | (string | string[])[])[] {
    // Convert this.attributes + this.slices into the right
    //   query format. Include the path from the root model
    //   to the attributes' model.
    let initialValues = this.attributes[this.root].map((attr) =>
      this.attributeNameWithPredicate(attr.model_name, attr.attribute_name)
    );

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
            this.predicateWithSlice(path as string[], attr, flatten) as (
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
    attribute: QueryColumn,
    flatten: boolean = true
  ): (string | string[] | (string | string[] | number)[])[] {
    // If there is a slice associated with this predicate, we'll
    // inject it here.
    let matchingSlice = this.slices.find(
      (slice) => slice.modelName === attribute.model_name
    );

    let predicate: (string | string[] | (string | string[] | number)[])[] = [];

    let previousModelName = this.root;
    path.forEach((modelName: string) => {
      predicate.push(modelName);
      if (this.graph.stepIsCollection(previousModelName, modelName)) {
        flatten ? predicate.push('::first') : predicate.push('::all');
      }
      previousModelName = modelName;
    });

    if (matchingSlice) {
      predicate.push(this.expandOperand(matchingSlice, false));
      predicate.push('::first');
    }

    predicate.push(
      ...this.attributeNameWithPredicate(
        attribute.model_name,
        attribute.attribute_name
      )
    );

    return predicate;
  }

  attributeNameWithPredicate(modelName: string, attributeName: string) {
    // Probably only used for File / Image / FileCollection attributes?
    let predicate = [attributeName];
    if (this.graph.attributeIsFile(modelName, attributeName)) {
      predicate.push('::url');
    }

    return predicate;
  }
}

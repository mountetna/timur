import {QueryColumn, QueryFilter} from '../contexts/query/query_types';
import {QueryGraph} from './query_graph';

export class QueryBuilder {
  graph: QueryGraph;
  recordFilters: QueryFilter[] = [];
  slices: QueryFilter[] = [];
  attributes: {[key: string]: QueryColumn[]} = {};
  root: string = '';
  flatten: boolean = true;
  orRecordFilterIndices: number[] = [];

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

  setFlatten(flat: boolean) {
    this.flatten = flat;
  }

  setOrRecordFilterIndices(orRecordFilterIndices: number[]) {
    this.orRecordFilterIndices = orRecordFilterIndices;
  }

  query(): any[] {
    return [
      this.root,
      ...this.expandedOperands(this.recordFilters),
      '::all',
      this.joinAttributesSlices()
    ];
  }

  count(): any[] {
    return [this.root, ...this.expandedOperands(this.recordFilters), '::count'];
  }

  expandOperand(
    filter: QueryFilter,
    includeModelPath: boolean = true
  ): (string | string[] | number)[] {
    let result: (string | string[] | number)[] = [];

    if (includeModelPath && undefined != this.pathToModel(filter.modelName))
      result.push(...(this.pathToModel(filter.modelName) as string[]));

    result.push(filter.attributeName);
    result.push(filter.operator);

    if (['::in', '::slice'].includes(filter.operator)) {
      result.push((filter.operand as string).split(','));
    } else if (['::has', '::lacks'].includes(filter.operator)) {
      // invert the model and attribute names, ignore operand
      let length = result.length;
      let tmpOperator = result[length - 1];
      result[length - 1] = result[length - 2];
      result[length - 2] = tmpOperator;
    } else {
      result.push(filter.operand);
    }

    return result;
  }

  expandedOperands(filters: QueryFilter[]) {
    let expandedFilters: any[] = [];

    if (this.orRecordFilterIndices.length > 0) {
      let andFilters: any[] = ['::and'];
      let orFilters: any[] = ['::or'];

      filters.forEach((filter, index: number) => {
        let expandedFilter = this.expandOperand(
          filter,
          this.root !== filter.modelName
        );

        if (this.orRecordFilterIndices.includes(index)) {
          orFilters.push(expandedFilter);
        } else {
          andFilters.push(expandedFilter);
        }
      });

      andFilters.push(orFilters);
      expandedFilters = [andFilters];
    } else {
      expandedFilters = filters.map((filter) =>
        this.expandOperand(filter, this.root !== filter.modelName)
      );
    }
    return expandedFilters;
  }

  pathToModel(targetModel: string): string[] | undefined {
    let path = this.graph
      .allPaths(this.root)
      .find((potentialPath: string[]) => potentialPath.includes(targetModel));

    if (!path) return;

    // Direct children paths include the root, and
    //   we'll filter it out so all paths do not
    //   include the root model (eliminate redundancy).
    return this.pathWithModelPredicates(
      path
        ?.slice(0, path.indexOf(targetModel) + 1)
        .filter((m) => m !== this.root)
    );
  }

  allOrFirst() {
    return this.flatten ? '::first' : '::all';
  }

  pathWithModelPredicates(path: string[]): string[] {
    let updatedPath: string[] = [];
    let previousModelName = this.root;
    path.forEach((modelName: string) => {
      updatedPath.push(modelName);
      if (this.graph.stepIsOneToMany(previousModelName, modelName)) {
        updatedPath.push(this.allOrFirst());
      }
      previousModelName = modelName;
    });

    return updatedPath;
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
  joinAttributesSlices(): (string | string[] | (string | string[])[])[] {
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
  ): (string | string[] | (string | string[] | number)[])[] {
    // If there is a slice associated with this predicate, we'll
    // inject it here, before the ::first or ::all predicate.
    let matchingSlice = this.slices.find(
      (slice) => slice.modelName === attribute.model_name
    );

    let predicate: (string | string[] | (string | string[] | number)[])[] = [
      ...path
    ];

    let includeAttributeName = true;

    if (matchingSlice) {
      if (this.isMatchingMatrixSlice(matchingSlice, attribute)) {
        // For matrices (i.e. ::slice), we'll construct it
        //   a little differently.
        predicate = predicate.concat(this.expandOperand(matchingSlice, false));
        // attribute name already
        // included as part of the expanded operand
        includeAttributeName = false;
      } else if (this.isTableSlice(matchingSlice)) {
        // This splicing works for tables.
        // Adds in a new array for the operand before
        //   the ::first or ::all
        predicate.splice(
          predicate.length - 1,
          0,
          this.expandOperand(matchingSlice, false)
        );
      }
    }

    if (includeAttributeName)
      predicate.push(
        ...this.attributeNameWithPredicate(
          attribute.model_name,
          attribute.attribute_name
        )
      );

    return predicate;
  }

  isMatchingMatrixSlice(slice: QueryFilter, attribute: QueryColumn) {
    return (
      slice.operator === '::slice' &&
      slice.attributeName === attribute.attribute_name
    );
  }

  isTableSlice(slice: QueryFilter) {
    return slice.operator !== '::slice';
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

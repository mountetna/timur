import * as _ from 'lodash';
import {
  QueryColumn,
  QueryFilter,
  QuerySlice,
  QueryBase
} from '../contexts/query/query_types';
import {QueryGraph} from './query_graph';
import {Model} from '../models/model_types';
import QuerySimplePathBuilder from './query_simple_path_builder';
import QueryFilterPathBuilder from './query_filter_path_builder';
import {
  attributeIsFile,
  isMatrixSlice,
  getPath
} from '../selectors/query_selector';
import {
  injectValueAtPath,
  nextInjectionPathItem
} from './query_any_every_helpers';
import FilterOperator from '../components/query/query_filter_operator';

export class QueryBuilder {
  graph: QueryGraph;
  models: {[key: string]: Model};
  recordFilters: QueryFilter[] = [];
  columns: QueryColumn[] = [];
  root: string = '';
  flatten: boolean = true;
  orRecordFilterIndices: number[] = [];

  constructor(graph: QueryGraph, models: {[key: string]: Model}) {
    this.graph = graph;
    this.models = models;
  }

  addRootModel(modelName: string) {
    this.root = modelName;
  }

  addColumns(columns: QueryColumn[]) {
    this.columns = this.columns.concat(columns);
  }

  addRecordFilters(recordFilters: QueryFilter[]) {
    this.recordFilters = recordFilters;
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
      this.expandColumns()
    ];
  }

  count(): any[] {
    return [this.root, ...this.expandedOperands(this.recordFilters), '::count'];
  }

  serializeQueryBase(queryBase: QueryBase): any[] {
    let result: any[] = [];

    result.push(queryBase.attributeName);
    result.push(queryBase.operator);

    if (FilterOperator.commaSeparatedOperators.includes(queryBase.operator)) {
      result.push((queryBase.operand as string).split(','));
    } else if (
      FilterOperator.terminalInvertOperators.includes(queryBase.operator)
    ) {
      // invert the model and attribute names, ignore operand
      let length = result.length;
      let tmpOperator = result[length - 1];
      result[length - 1] = result[length - 2];
      result[length - 2] = tmpOperator;
    } else if (FilterOperator.terminalOperators.includes(queryBase.operator)) {
      // ignore operand
    } else {
      result.push(queryBase.operand);
    }

    return result;
  }

  filterWithPath(filter: QueryBase, includeModelPath: boolean = true): any[] {
    let result: any[] = this.serializeQueryBase(filter);

    let path: string[] | undefined = this.filterPathWithModelPredicates(
      filter as QueryFilter
    );
    if (includeModelPath && undefined != path) {
      // Inject the current [attribute, operator, operand] into
      //   the deepest array, between [model, "::any"]...
      //   to get [model, [attribute, operator, operand], "::any"]
      // At this point we know we're injecting into a tuple, so
      //   construct the valueInjectionPath that way.
      let injectionPath = nextInjectionPathItem(
        getPath(path, filter.modelName, [])
      );
      injectValueAtPath(path, injectionPath, result);
      result = path;
    }

    return result;
  }

  expandedOperands(filters: QueryFilter[]) {
    let expandedFilters: any[] = [];
    let andFilters: any[] = ['::and'];

    if (this.orRecordFilterIndices.length > 0) {
      let orFilters: any[] = ['::or'];

      filters.forEach((filter, index: number) => {
        let expandedFilter = this.filterWithPath(
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
    } else if (filters.length > 1) {
      andFilters = andFilters.concat(
        filters.map((filter) =>
          this.filterWithPath(filter, this.root !== filter.modelName)
        )
      );
      expandedFilters = [andFilters];
    } else if (filters.length > 0) {
      expandedFilters = filters.map((filter) =>
        this.filterWithPath(filter, this.root !== filter.modelName)
      );
    }
    return expandedFilters;
  }

  filterPathWithModelPredicates(filter: QueryFilter): any[] | undefined {
    const pathWithoutRoot = this.graph.shortestPath(
      this.root,
      filter.modelName
    );

    if (!pathWithoutRoot) return;

    // When constructing this path for a filter,
    //   we need to nest any collection models.
    const filterBuilder = new QueryFilterPathBuilder(
      pathWithoutRoot,
      this.root,
      this.models,
      filter.anyMap
    );
    return filterBuilder.build();
  }

  slicePathWithModelPredicates(targetModelName: string): any[] | undefined {
    const pathWithoutRoot = this.graph.shortestPath(this.root, targetModelName);

    if (!pathWithoutRoot) return;

    const pathBuilder = new QuerySimplePathBuilder(
      pathWithoutRoot,
      this.root,
      this.models,
      this.flatten
    );
    return pathBuilder.build();
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
  expandColumns(): (string | string[] | (string | string[])[])[] {
    // Convert this.attributes + this.slices into the right
    //   query format. Include the path from the root model
    //   to the attributes' model.
    if (this.columns.length === 0) return [''];

    let initialValues = this.predicateWithSlice([], this.columns[0]);

    return this.columns.slice(1).reduce(
      (acc: any[], column: QueryColumn) => {
        if (column.model_name === this.root) {
          acc.push(this.predicateWithSlice([], column));
        } else {
          let path = this.slicePathWithModelPredicates(column.model_name);

          acc.push(
            this.predicateWithSlice((path || []) as string[], column) as (
              | string
              | string[]
            )[]
          );
        }

        return acc;
      },
      [...initialValues]
    );
  }

  predicateWithSlice(
    path: string[],
    column: QueryColumn
  ): (string | string[] | (string | string[] | number)[])[] {
    // If there is a slice associated with this predicate, we'll
    // inject it here, before the ::first or ::all predicate.
    let matchingSlices = column.slices || [];

    let predicate: (string | string[] | (string | string[] | number)[])[] = [
      ...path
    ];

    let includeAttributeName = true;

    matchingSlices.forEach((matchingSlice: QuerySlice) => {
      if (isMatrixSlice(matchingSlice)) {
        // For matrices (i.e. ::slice), we'll construct it
        //   a little differently.
        predicate = predicate.concat(this.serializeQueryBase(matchingSlice));
        // attribute name already
        // included as part of the expanded operand
        includeAttributeName = false;
      } else if (this.isTableSlice(matchingSlice)) {
        // This splicing works for tables.
        // Adds in a new array for the operand before
        //   the ::first or ::all
        let sliceModelIndex = predicate.indexOf(matchingSlice.modelName);
        predicate.splice(
          sliceModelIndex + 1,
          0,
          this.serializeQueryBase(matchingSlice)
        );
      }
    });

    if (includeAttributeName)
      predicate.push(
        ...this.attributeNameWithPredicate(
          column.model_name,
          column.attribute_name
        )
      );

    return predicate;
  }

  isTableSlice(slice: QuerySlice) {
    return !isMatrixSlice(slice);
  }

  attributeNameWithPredicate(modelName: string, attributeName: string) {
    // Probably only used for File / Image / FileCollection attributes?
    let predicate = [attributeName];
    if (attributeIsFile(this.models, modelName, attributeName)) {
      predicate.push('::url');
    }

    return predicate;
  }
}

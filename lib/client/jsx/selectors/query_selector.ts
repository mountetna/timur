import * as _ from 'lodash';

import {Attribute, Model} from '../models/model_types';
import {
  EmptyQueryClause,
  QueryColumn,
  QuerySlice,
  QueryTableColumn
} from '../contexts/query/query_types';
import {QueryGraph} from '../utils/query_graph';

export const modelHasAttribute = (
  magmaModels: {[key: string]: Model},
  modelName: string,
  attributeName: string
) => {
  if (!magmaModels[modelName]) return false;

  return !!magmaModels[modelName].template.attributes[attributeName];
};

const attributeIs = (
  magmaModels: {[key: string]: Model},
  modelName: string,
  attributeName: string,
  types: string[]
) => {
  if (!modelHasAttribute(magmaModels, modelName, attributeName)) return false;

  return types.includes(
    magmaModels[modelName].template.attributes[attributeName].attribute_type
  );
};

export const attributeIsMatrix = (
  magmaModels: {[key: string]: Model},
  modelName: string,
  attributeName: string
) => {
  return attributeIs(magmaModels, modelName, attributeName, ['matrix']);
};

export const selectAllowedModelAttributes = (
  attributes: Attribute[]
): Attribute[] => {
  // I think we should force people to get these FK values
  //   from the other model, because generally people won't want
  //   the FK itself, just some attributes of the other model.
  // Keep "identifier" because it's useful for ::has and ::lacks
  const unallowedAttributeTypes = [
    'parent',
    'child',
    'collection',
    'link',
    'table'
  ];
  return attributes.filter(
    (attr: Attribute) => !unallowedAttributeTypes.includes(attr.attribute_type)
  );
};

export const selectMatrixAttributes = (
  attributes: Attribute[],
  selectedAttributes: QueryColumn[]
): Attribute[] => {
  const selectedAttributeNames = selectedAttributes.map(
    (attr) => attr.attribute_name
  );

  return attributes.filter(
    (attr) =>
      'matrix' === attr.attribute_type &&
      selectedAttributeNames.includes(attr.attribute_name)
  );
};

export const selectMatrixModelNames = (
  magmaModels: any,
  columns: QueryColumn[]
): string[] => {
  return columns
    .filter((column: QueryColumn) =>
      attributeIsMatrix(magmaModels, column.model_name, column.attribute_name)
    )
    .map((column: QueryColumn) => column.model_name);
};

export const selectCollectionModelNames = (
  graph: QueryGraph,
  rootModelName: string,
  selectedAttributeModelNames: string[]
): string[] => {
  let sliceableModelNames: Set<string> = new Set();

  const fullParentage: string[] = graph.graph.fullParentage(rootModelName);

  graph.allPaths(rootModelName).forEach((path: string[]) => {
    for (let i = 0; i < path.length - 1; i++) {
      let current = path[i];
      let next = path[i + 1];
      if ((current === rootModelName && !next) || next === rootModelName) {
        continue;
      } else if (
        i === 0 &&
        graph.stepIsOneToMany(rootModelName, current) &&
        selectedAttributeModelNames.includes(current)
      ) {
        sliceableModelNames.add(current);
      } else if (
        graph.stepIsOneToMany(current, next) &&
        !fullParentage.includes(next) &&
        selectedAttributeModelNames.includes(next)
      ) {
        sliceableModelNames.add(next);
      }
    }
  });

  return [...sliceableModelNames];
};

export const getPath = (
  array: any[],
  heading: string,
  currentPath: number[]
): number[] => {
  if (!array) return [];
  if (!Array.isArray(array)) array = [array];

  let index = array.indexOf(heading);
  if (index > -1) return currentPath.concat([index]);

  let innerPath: number[] = [];
  array.forEach((ele, index: number) => {
    if (Array.isArray(ele)) {
      let tempPath = getPath(ele, heading, currentPath.concat(index));
      if (tempPath.length > 0) {
        innerPath = tempPath;
      }
    }
  });

  return innerPath.length > 0 ? innerPath : [];
};

export const pathToColumn = (
  array: any[],
  heading: string,
  expandMatrices: boolean
): string => {
  let indexlessHeading = heading.split('@')[0];
  let startingIndexPlusMatrixColId = heading.split('@')[1];

  if (!startingIndexPlusMatrixColId) return '-1';

  let fullPath: number[] = [];

  if (expandMatrices) {
    let startingIndex = parseInt(startingIndexPlusMatrixColId.split('.')[0]);
    let sliceColId = startingIndexPlusMatrixColId.split('.')[1];

    fullPath = getPath(array[startingIndex], indexlessHeading, [startingIndex]);

    if (!sliceColId) return fullPath.length > 0 ? fullPath[0].toString() : '-1';

    // fullPath returns the path to project#model::attribute.
    //   The tuple should be [project#model::attribute, [array, of, slice, operands]]
    let pathToSliceOperands = fullPath.slice(0, -1);
    pathToSliceOperands.push(1);
    let sliceOperands = _.at(array, pathToSliceOperands.join('.'))[0];

    if (sliceOperands == null) return '-1';

    let sliceIndex = sliceOperands.indexOf(sliceColId);

    // Get rid of the extra [1] used to find the slice operands
    return pathToSliceOperands.slice(0, -1).concat([sliceIndex]).join('.');
  } else {
    let startingIndex = parseInt(startingIndexPlusMatrixColId);

    if (!Array.isArray(array[startingIndex])) {
      if (array[startingIndex] === indexlessHeading)
        return startingIndex.toString();
      else return '-1';
    }

    fullPath = getPath(array[startingIndex], indexlessHeading, [startingIndex]);

    return fullPath.length > 0 ? fullPath[0].toString() : '-1';
  }
};

export const stepIsOneToMany = (
  magmaModels: {[key: string]: Model},
  start: string,
  end: string
) => {
  // For a single model relationship (start -> end),
  //   returns `true` if it is a one-to-many
  //   relationship.
  return attributeIs(magmaModels, start, end, ['table', 'collection']);
};

export const attributeIsFile = (
  magmaModels: {[key: string]: Model},
  modelName: string,
  attributeName: string
) => {
  return attributeIs(magmaModels, modelName, attributeName, [
    'file',
    'image',
    'file_collection'
  ]);
};

export const isMatrixSlice = (slice: QuerySlice) =>
  '::slice' === slice.clause.operator;

export const hasMatrixSlice = (column: QueryColumn) => {
  return column.slices.some((slice) => isMatrixSlice(slice));
};

export const emptyQueryClauseStamp = (modelName: string) => {
  return {
    ...EmptyQueryClause,
    modelName
  };
};

export const queryColumnMatrixHeadings = (column: QueryColumn) => {
  return column.slices
    .filter((slice) => isMatrixSlice(slice))
    .map((slice) => {
      return (slice.clause.operand as string).split(',');
    })
    .flat();
};

export const isIdentifierQuery = (
  columns: QueryColumn[] | QueryTableColumn[]
) => {
  return columns.length === 1;
};

export const userColumns = (columns: QueryColumn[]) => {
  const columnLabels = columns.map(
    ({display_label}: {display_label: string}) => display_label
  );

  return isIdentifierQuery(columns)
    ? [columnLabels[0], columnLabels[0]]
    : columnLabels;
};

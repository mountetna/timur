import * as _ from 'lodash';

import {Attribute, Model} from '../models/model_types';
import {QueryColumn, QueryFilter} from '../contexts/query/query_types';
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
  selectedAttributes: {[key: string]: QueryColumn[]}
): string[] => {
  return Object.entries(selectedAttributes)
    .filter(([modelName, attributes]: [string, QueryColumn[]]) =>
      attributes.some((attr) =>
        attributeIsMatrix(magmaModels, modelName, attr.attribute_name)
      )
    )
    .map(([modelName, attributes]: [string, QueryColumn[]]) => modelName);
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
      if (current === rootModelName || next === rootModelName) {
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
  let index = array.indexOf(heading);
  if (index > -1) return index.toString();

  let fullPath: number[] = [];

  if (expandMatrices) {
    let nonMatrixColId = heading.split('.')[0];
    let sliceColId = heading.split('.')[1];

    fullPath = getPath(array, nonMatrixColId, []);

    if (!sliceColId) return fullPath.length > 0 ? fullPath[0].toString() : '-1';

    // fullPath returns the path to project#model::attribute.
    //   The tuple should be [project#model::attribute, [array, of, slice, operands]]
    let pathToSliceOperands = fullPath.slice(0, -1);
    pathToSliceOperands.push(1);
    let sliceOperands = _.at(array, pathToSliceOperands.join('.'))[0];

    let sliceIndex = sliceOperands.indexOf(sliceColId);

    // Disgard the extra [1] here from pathToSliceOperands,
    //   because of the answer format
    return fullPath.slice(0, -1).concat([sliceIndex]).join('.');
  } else {
    fullPath = getPath(array, heading, []);
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

export const isMatrixSlice = (slice: QueryFilter) =>
  '::slice' === slice.operator;

export const isMatchingMatrixSlice = (
  slice: QueryFilter,
  attribute: QueryColumn
) => {
  return (
    isMatrixSlice(slice) &&
    slice.attributeName === attribute.attribute_name &&
    slice.modelName === attribute.model_name
  );
};

export const hasMatrixSlice = (
  slices: QueryFilter[],
  attribute: QueryColumn
) => {
  return slices.some((slice) => isMatchingMatrixSlice(slice, attribute));
};

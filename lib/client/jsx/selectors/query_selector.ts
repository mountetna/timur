import * as _ from 'lodash';

import {Attribute, Model} from '../models/model_types';
import {QueryColumn, QueryFilter} from '../contexts/query/query_types';

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

export const selectSliceableModelNames = (
  magmaModels: any,
  selectedAttributes: {[key: string]: QueryColumn[]}
): string[] => {
  // Only return table or matrix models if the user has selected
  //   attributes from them.
  // Determine if a model is a table by traversing up
  //   to its parent model, then seeing the relationship type
  //   back down to the original model.
  // Matrices have to be detected from the model-attribute directly.
  return selectTableModelNames(
    magmaModels,
    Object.keys(selectedAttributes)
  ).concat(selectMatrixModelNames(magmaModels, selectedAttributes));
};

const selectMatrixModelNames = (
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

export const selectTableModelNames = (
  magmaModels: any,
  modelNames: string[]
): string[] => {
  return modelNames.filter((modelName: string) => {
    let attributes: {[key: string]: {[key: string]: string}} =
      magmaModels[modelName].template.attributes;

    let parentModel: {[key: string]: string} | undefined = Object.values(
      attributes
    ).find((attr: {[key: string]: string}) => attr.attribute_type === 'parent');

    if (!parentModel) return false;

    return attributeIs(magmaModels, parentModel.attribute_name, modelName, [
      'table'
    ]);
  });
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
    // fullPath returns the path to project#model::attribute.
    //   Slice that out since we want the slices.
    // Add [1] because in the
    //   tuple, it should be [project#model::attribute, [array, of, slice, operands]]
    let pathToMatrixSlices = fullPath.slice(0, -1);
    pathToMatrixSlices.push(1);
    let matrixData = _.at(array, pathToMatrixSlices.join('.'))[0];
    let sliceIndex = matrixData.indexOf(sliceColId);

    return pathToMatrixSlices.concat([sliceIndex]).join('.');
  } else {
    fullPath = getPath(array, heading, []);
    return fullPath.length > 0 ? fullPath[0].toString() : '-1';
  }
};

export const modelHasAttribute = (
  magmaModels: {[key: string]: Model},
  modelName: string,
  attributeName: string
) => {
  if (!magmaModels[modelName]) return false;

  return !!magmaModels[modelName].template.attributes[attributeName];
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

export const attributeIsMatrix = (
  magmaModels: {[key: string]: Model},
  modelName: string,
  attributeName: string
) => {
  return attributeIs(magmaModels, modelName, attributeName, ['matrix']);
};

export const isMatchingMatrixSlice = (
  slice: QueryFilter,
  attribute: QueryColumn
) => {
  return (
    slice.operator === '::slice' &&
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

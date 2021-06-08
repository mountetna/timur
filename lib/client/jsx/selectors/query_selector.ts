import {Attribute} from '../models/model_types';
import {QueryColumn, QueryFilter} from '../contexts/query/query_types';

export const selectAllowedModelAttributes = (
  attributes: Attribute[]
): Attribute[] => {
  // I think we should force people to get these FK values
  //   from the other model, because generally people won't want
  //   the FK itself, just some attributes of the other model.
  const unallowedAttributeTypes = [
    'identifier',
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
    .filter(([modelName, attributes]: [string, QueryColumn[]]) => {
      let magmaAttributes = magmaModels[modelName].template.attributes;

      return attributes.some(
        (attr) =>
          'matrix' === magmaAttributes[attr.attribute_name].attribute_type
      );
    })
    .map(([modelName, attributes]: [string, QueryColumn[]]) => modelName);
};

const selectTableModelNames = (
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

    return (
      'table' ===
      magmaModels[parentModel.attribute_name].template.attributes[modelName]
        .attribute_type
    );
  });
};

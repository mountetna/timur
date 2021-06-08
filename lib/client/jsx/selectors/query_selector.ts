import {Attribute} from '../models/model_types';

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

export const selectSliceableModelNames = (
  magmaModels: any,
  modelNames: string[]
): string[] => {
  // Only return table or matrix models from the modelNames choice set.
  // Determine if a model is a table or matrix by traversing up
  //   to its parent model, then seeing the relationship type
  //   back down to the original model.
  return modelNames.filter((modelName: string) => {
    let attributes: {[key: string]: {[key: string]: string}} =
      magmaModels[modelName].template.attributes;

    let parentModel: {[key: string]: string} | undefined = Object.values(
      attributes
    ).find((attr: {[key: string]: string}) => attr.attribute_type === 'parent');

    console.log('parentModel', parentModel);
    if (!parentModel) return false;

    return ['table', 'matrix'].includes(
      magmaModels[parentModel.attribute_name].template.attributes[modelName]
        .attribute_type
    );
  });
};

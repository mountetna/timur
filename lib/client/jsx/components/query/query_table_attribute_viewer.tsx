import React from 'react';

import AttributeViewer from '../attributes/attribute_viewer';
import {Attribute} from 'etna-js/models/magma-model';
import {QueryGraph} from '../../utils/query_graph';

const QueryTableAttributeViewer = ({
  attribute,
  datum,
  modelName,
  graph,
  expandMatrices,
  matrixHeadings
}: {
  attribute: Attribute | null;
  datum: any;
  expandMatrices: boolean;
  modelName: string;
  graph: QueryGraph;
  matrixHeadings: string[] | undefined;
}) => {
  function filename(path: string | null) {
    return path == null
      ? null
      : new URL(`https://${path}`).pathname.split('/').pop();
  }

  function mockRecord(attribute: Attribute, value: any) {
    switch (attribute.attribute_type) {
      case 'file':
      case 'image':
        let name = filename(value);

        return {
          [attribute.attribute_name]: name
            ? {
                url: value,
                original_filename: name,
                path: name
              }
            : null
        };
      case 'file_collection':
        return {
          [attribute.attribute_name]: value?.map((datum: string) => {
            return {
              url: datum,
              original_filename: filename(datum),
              path: filename(datum)
            };
          })
        };
      default:
        return {
          [attribute.attribute_name]: value
        };
    }
  }

  if (!attribute) return null;

  return (
    <>
      {expandMatrices && attribute.attribute_type == 'matrix' ? (
        datum?.toString()
      ) : (
        <AttributeViewer
          attribute_name={attribute.attribute_name}
          record={mockRecord(attribute, datum)}
          model_name={modelName}
          template={graph.template(modelName)}
          mode='model_viewer'
          sliceValues={
            matrixHeadings && matrixHeadings.length > 0 ? matrixHeadings : null
          }
        />
      )}
    </>
  );
};

export default QueryTableAttributeViewer;

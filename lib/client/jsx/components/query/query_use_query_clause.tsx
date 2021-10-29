import React, {useMemo, useState, useEffect} from 'react';
import _ from 'lodash';

import {QueryClause} from '../../contexts/query/query_types';
import {selectAllowedModelAttributes} from '../../selectors/query_selector';
import {visibleSortedAttributesWithUpdatedAt} from '../../utils/attributes';
import {QueryGraph} from '../../utils/query_graph';

const useQueryClause = ({
  clause,
  graph
}: {
  clause: QueryClause;
  graph: QueryGraph;
}) => {
  const modelAttributes = useMemo(() => {
    if ('' !== clause.modelName) {
      const template = graph.template(clause.modelName);
      if (!template) return [];

      let sortedTemplateAttributes = visibleSortedAttributesWithUpdatedAt(
        template.attributes
      );

      return selectAllowedModelAttributes(sortedTemplateAttributes);
    }
    return [];
  }, [clause.modelName, graph]);

  const attributeType = useMemo(() => {
    if ('' !== clause.attributeName) {
      const template = graph.template(clause.modelName);
      if (!template) return 'text';

      switch (
        template.attributes[clause.attributeName].attribute_type.toLowerCase()
      ) {
        case 'string':
          return 'text';
        case 'date_time':
          return 'date';
        case 'integer':
        case 'float':
        case 'number':
          return 'number';
        case 'boolean':
          return 'boolean';
        case 'matrix':
          return 'matrix';
        default:
          return 'text';
      }
    }
    return 'text';
  }, [clause.attributeName, clause.modelName, graph]);

  return {
    modelAttributes,
    attributeType
  };
};

export default useQueryClause;

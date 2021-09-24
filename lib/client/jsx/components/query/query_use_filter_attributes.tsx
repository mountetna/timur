import React, {useMemo, useState, useEffect} from 'react';
import _ from 'lodash';

import {QueryFilter, QuerySlice} from '../../contexts/query/query_types';
import {selectAllowedModelAttributes} from '../../selectors/query_selector';
import {visibleSortedAttributesWithUpdatedAt} from '../../utils/attributes';
import {QueryGraph} from '../../utils/query_graph';

const useFilterAttributes = ({
  filter,
  graph
}: {
  filter: QueryFilter | QuerySlice;
  graph: QueryGraph;
}) => {
  const [template, setTemplate] = useState(null as any);

  useEffect(() => {
    setTemplate(graph.template(filter.modelName));
  }, [filter.modelName, graph]);

  const modelAttributes = useMemo(() => {
    if ('' !== filter.modelName) {
      if (!template) return [];

      let sortedTemplateAttributes = visibleSortedAttributesWithUpdatedAt(
        template.attributes
      );

      return selectAllowedModelAttributes(sortedTemplateAttributes);
    }
    return [];
  }, [filter.modelName, template]);

  const attributeType = useMemo(() => {
    if ('' !== filter.attributeName) {
      if (!template) return 'text';

      switch (
        template.attributes[filter.attributeName].attribute_type.toLowerCase()
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
  }, [filter.attributeName, template]);

  return {
    modelAttributes,
    attributeType
  };
};

export default useFilterAttributes;

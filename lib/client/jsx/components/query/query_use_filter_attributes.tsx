import React, {useMemo} from 'react';
import _ from 'lodash';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectTemplate} from 'etna-js/selectors/magma';

import {QueryFilter, QuerySlice} from '../../contexts/query/query_types';
import {selectAllowedModelAttributes} from '../../selectors/query_selector';
import {visibleSortedAttributesWithUpdatedAt} from '../../utils/attributes';

const useFilterAttributes = ({filter}: {filter: QueryFilter | QuerySlice}) => {
  let reduxState = useReduxState();

  const modelAttributes = useMemo(() => {
    if ('' !== filter.modelName) {
      let template = selectTemplate(reduxState, filter.modelName);

      if (!template) return [];

      let sortedTemplateAttributes = visibleSortedAttributesWithUpdatedAt(
        template.attributes
      );

      return selectAllowedModelAttributes(sortedTemplateAttributes);
    }
    return [];
  }, [filter.modelName, reduxState]);

  const attributeType = useMemo(() => {
    if ('' !== filter.attributeName) {
      let template = selectTemplate(reduxState, filter.modelName);

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
  }, [filter.attributeName, filter.modelName, reduxState]);

  return {
    modelAttributes,
    attributeType
  };
};

export default useFilterAttributes;
